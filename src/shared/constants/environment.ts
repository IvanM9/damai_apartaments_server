require('dotenv').config();

export const environment = {
    page: process.env.PAGE || 1,
    limit: process.env.LIMIT || 10,
};