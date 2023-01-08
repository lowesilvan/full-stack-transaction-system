export interface Api {
    status: String,
    data: Array<Transaction>
}

export interface Transaction {
    sender: String,
    receiver: String,
    value: Number,
    confirmed: Boolean,
    timestamp: String,
}