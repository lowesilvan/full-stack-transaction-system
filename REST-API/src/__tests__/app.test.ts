import supertest from 'supertest';
import app from '../app';

export const transaction = {
    sender: "Dark matter",
    receiver: "giver",
    value: 2000000,
    confirmed: false,
    timestamp: "1990-09-09 17:45:30"
};

describe("transactions", () => {
    

    describe("get all transactions", () => {

        describe("transaction is defined", () => {

            it("should return a 200 status and be defined", async () => {

                const { body, statusCode } = await supertest(app).get(`/api`);

                expect(statusCode).toBe(200);

                expect(body).toBeDefined()
            })
        });
    })

    describe("get transaction route", () => {

        describe("given the transaction doesn't exist", () => {

            it("should return a 404 status", async () => {
                const transactionId = 'transaction-123'

                await supertest(app).get(`/api/${transactionId}`).expect(404)
            })
        });

        describe("given the transaction does exist", () => {

            it("should return a 200 status", async () => {
                const transactionId = 'e4094f71-4f55-4d26-96b9-8c435452f4e6'

                await supertest(app).get(`/api/${transactionId}`).expect(200)
            })
        })
    });

    describe("create transaction", () => {

        describe("given transaction payload", () => {

            it("should return a 200 status and be defined", async () => {

                const { body, statusCode } = await supertest(app).post(`/api`).send(transaction);

                expect(statusCode).toBe(200);

                expect(body).toBeDefined()
            })
        });
    })
});