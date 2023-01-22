import express, { Application, Request, Response } from "express";
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");
const schedule = require('node-schedule');
const crypto = require("crypto");
const { DataTypes, Op } = require("sequelize");
const env = require("dotenv");
const cors = require('cors')

env.config();

// express app instance
const app: Application = express();

//define port number
const port = process.env.PORT || 5000;

// sequelize instance
const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: "mysql",
    }
);

// verify mysql database host connection with sequelize
sequelize
    .authenticate()
    .then(() => {
        app.listen(port, () => {
            console.log(
                `connected to Database successfully and Started server at http://localhost:${port}`
            );
        });
    })
    .catch((err: JSON) => console.log("Error connecting to database", err));

// define transaction model
const transaction = sequelize.define("transaction", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        unique: true,
    },

    sender: {
        type: DataTypes.STRING,
        allowNull: false
    },

    receiver: {
        type: DataTypes.STRING,
        allowNull: false
    },

    value: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    confirmed: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },

    timestamp: {
        type: DataTypes.DATE(6),
        allowNull: false
    },
});

// sync table with db
transaction
    .sync()
    .then((result: JSON) => console.log("Table and model synced successfully", result))
    .catch((err: Error) => console.log("Error syncing the table and model" ,err));

// middlewares
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// routes

// Query all transactions
app.get("/api", async (req: Request, res: Response) => {
    try {
        const allTransactions = await transaction.findAll({
            order: [['updatedAt', 'DESC']]
        });
        if (allTransactions.length <= 0) {
            res.status(404).send({
                message: "Transaction not found",
            });
        }
        res.status(200).json({
            status: "success",
            data: allTransactions,
        });
    } catch {
        console.log("Failed to get transactions");
    }
});

// Create a new transaction
app.post("/api", async (req: Request, res: Response) => {
    try {
        const { sender, receiver, value, confirmed, timestamp } = req.body;
        const saveTransaction = transaction.build({
            sender,
            receiver,
            value,
            confirmed,
            timestamp,
        });

        await saveTransaction.save();
        res.status(200).send(`New Transaction Created for "${sender}"`);
    } catch {
        res.status(500).send("Transaction Failed");
    }
});

// Query a specific transaction
app.get("/api/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const theTransaction = await transaction.findAll({
            where: {
                id,
            },
        });

        if (theTransaction.length <= 0) {
            res.status(404).send({
                message: "Transaction not found",
            });
        }
        res.json({
            status: "success",
            data: theTransaction,
        });
    } catch {
        console.log("Failed to get transaction");
    }
});

//update a specific transaction
app.put("/api/:id", async (req: Request, res: Response) => {
    try {
        const { sender, receiver, value, confirmed, timestamp } = req.body;
        const { id } = req.params;
        transaction.update(
            {
                sender,
                receiver,
                value,
                confirmed,
                timestamp,
            },
            {
                where: {
                    id,
                },
            }
        );
        res.status(200).send(`Transaction updated successfully`);
    } catch {
        res.status(500).send("Transaction Failed to Update");
    }
});

//delete a specific transaction
app.delete("/api/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        transaction.destroy({
            where: {
                id,
            },
        });
        res.status(200).send(`Transaction deleted for successfully"`);
    } catch {
        res.status(500).send("Transaction Failed to Delete");
    }
});

// Query all confirmed transactions
app.get("/api/transactions-confirmed/:state", async (req: Request, res: Response) => {
    try {
        const { state } = req.params
        const transactionState = await transaction.findAll({
            where: {
                confirmed: state,
            },
        });
        if (transactionState.length <= 0) {
            res.status(404).send({
                message: "Transaction not found",
            });
        }
        res.status(200).json({
            status: "success",
            data: transactionState,
        });
    } catch {
        res.status(500).send("Failed to get transaction");
    }
});

// Query transactions in a range of date
// app.get("/api/history/:start:end", async (req: Request, res: Response) => {
//     try {
//         // const startedDate = "1980-12-12 00:00:00";
//         // const endDate = "2022-12-26 00:00:00";
//         const { startDate, endDate } = req.params
//         const transactionRange = await transaction.findAll({
//             where: {
//                 createdAt: {
//                     [Op.between]: [endDate, startDate],
//                 }
//             }
//         });
//         if (transactionRange.length <= 0) {
//             res.status(404).send({
//                 message: "Transaction not found",
//             });
//         }
//         res.status(200).json({
//             status: "success",
//             data: transactionRange
//         });
//     } catch {
//         res.status(500).send("Failed to get transaction");
//     }
// });

// Schedule cron jobs

schedule.scheduleJob('1 * * * * *', function() {
    // console.log("repeat")
    // addTransaction()
    
})

export default app

const addTransaction = async () => {
    const value = Math.floor(Math.random() * 100000);
    const timestamp = new Date()
    const confirmed = true
    const sender = crypto.randomUUID()
    const receiver = crypto.randomUUID()

    console.log({value, timestamp, confirmed, sender, receiver})

    try {
        const saveTransaction = transaction.build({
            sender,
            receiver,
            value,
            confirmed,
            timestamp
        });

        await saveTransaction.save();
        console.log(`New Mock Transaction Created`);
    } catch(err) {
        console.log("Transaction Failed" + err);
    }
}