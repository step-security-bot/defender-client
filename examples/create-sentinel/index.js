require('dotenv').config();

const abi = require('./abis/erc721.json')
const { SentinelClient } = require('defender-sentinel-client');

async function main() {
    const creds = { apiKey: process.env.ADMIN_API_KEY, apiSecret: process.env.ADMIN_API_SECRET };
    const client = new SentinelClient(creds);

    let notification;
    // use an existing notification channel
    const notificationChannels = await client.listNotificationChannels()
    if (notificationChannels.length > 0) {
        // Select your desired notification channel
        notification = notificationChannels[0]
    } else {
        // OR create a new notification channel
        notification = await client.createNotificationChannel('email', {
            name: 'MyEmailNotification',
            config: {
                emails: ['john@example.com']
            },
            paused: false
        })
    }

    // populate the request parameters for a Forta Sentinel

    const fortaRequestParameters = {
        type: 'FORTA', // BLOCK or FORTA
        name: 'MyNewFortaSentinel',
        // optional
        addresses: ['0x0f06aB75c7DD497981b75CD82F6566e3a5CAd8f2'],
        // optional
        agentIDs: [],
        fortaConditions: {
            // optional
            alertIDs: [],
            minimumScannerCount: 0,
            // optional
            severity: 2, // (unknown=0, info=1, low=2, medium=3, high=4, critical=5)
        },
        // optional
        paused: false,
        // optional
        autotaskCondition: '3dcfee82-f5bd-43e3-8480-0676e5c28964',
        // optional
        autotaskTrigger: undefined,
        // optional
        alertThreshold: {
            amount: 2,
            windowSeconds: 3600,
        },
        // optional
        alertTimeoutMs: 0,
        notificationChannels: [notification.notificationId],
    }

    // populate the request parameters for a Block Sentinel

    const blockRequestParameters = {
        type: 'BLOCK', // BLOCK or FORTA
        network: 'rinkeby',
        // optional
        confirmLevel: 1, // if not set, we pick the blockwatcher for the chosen network with the lowest offset
        name: 'MyNewSentinel',
        address: '0x0f06aB75c7DD497981b75CD82F6566e3a5CAd8f2',
        abi: JSON.stringify(abi),
        // optional
        paused: false,
        eventConditions: [
            { eventSignature: 'OwnershipTransferred(address,address)', expression: 'previousOwner=0x0f06aB75c7DD497981b75CD82F6566e3a5CAd8f2' },
            { eventSignature: 'Transfer(address,address,uint256)' }
        ],
        functionConditions: [{ functionSignature: 'renounceOwnership()' }],
        // optional
        txCondition: 'gasPrice > 0',
        // optional
        autotaskCondition: '3dcfee82-f5bd-43e3-8480-0676e5c28964',
        // optional
        autotaskTrigger: undefined,
        // optional
        alertThreshold: {
            amount: 2,
            windowSeconds: 3600,
        },
        // optional
        alertTimeoutMs: 0,
        notificationChannels: [notification.notificationId],
    }

    // call create with the request parameters
    const sentinelResponse = await client.create(fortaRequestParameters);

    console.log(sentinelResponse);
}

if (require.main === module) {
    main().catch(console.error);
}