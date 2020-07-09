/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class FabUser extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const users = [
            {
                username: 'kim',
                email: '123@gmail.com',
                phone: '010-1234-5678',
                words: 'Hello',
            },
            {
                username: 'bak',
                email: '456@gmail.com',
                phone: '010-2345-6789',
                words: 'Hello it me',
            },
            {
                username: 'choi',
                email: '789@gmail.com',
                phone: '010-3456-7890',
                words: 'Hello Hello',
            },
            {
                username: 'sun',
                email: '111@gmail.com',
                phone: '010-4567-8901',
                words: 'Hello is is',
            },
            {
                username: 'moon',
                email: '222@gmail.com',
                phone: '010-5678-9012',
                words: 'Hello why',
            }
        ];

        for (let i = 0; i < users.length; i++) {
            users[i].docType = 'user';
            await ctx.stub.putState('USER' + i, Buffer.from(JSON.stringify(users[i])));
            console.info('Added <--> ', users[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryUser(ctx, userNumber) {
        const userAsBytes = await ctx.stub.getState(userNumber); // get the car from chaincode state
        if (!userAsBytes || userAsBytes.length === 0) {
            throw new Error(`${userNumber} does not exist`);
        }
        console.log(userAsBytes.toString());
        return userAsBytes.toString();
    }

    async createUser(ctx, userNumber, username, email, phone, words) {
        console.info('============= START : Create User ===========');

        const users = {
            username,
            docType: 'user',
            email,
            phone,
            words,
        };

        await ctx.stub.putState(userNumber, Buffer.from(JSON.stringify(users)));
        console.info('============= END : Create User ===========');
    }

    async queryAllUsers(ctx) {
        const startKey = 'USER0';
        const endKey = 'USER99';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async changeUsername(ctx, userNumber, newUsername) {
        console.info('============= START : changeUsernamer ===========');

        const userAsBytes = await ctx.stub.getState(userNumber); // get the car from chaincode state
        if (!userAsBytes || userAsBytes.length === 0) {
            throw new Error(`${userNumber} does not exist`);
        }
        const users = JSON.parse(userAsBytes.toString());
        users.username = newUsername;

        await ctx.stub.putState(userNumber, Buffer.from(JSON.stringify(users)));
        console.info('============= END : changeUsername ===========');
    }

}

module.exports = FabUser;
