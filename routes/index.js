var express = require('express')
var router = express()

const CosmosClient = require('@azure/cosmos').CosmosClient

const config = require('../config')
const url = require('url')

const endpoint = config.endpoint
const key = config.key

const databaseId = config.database.id
const containerId = config.container.id

const client = new CosmosClient({ endpoint, key })

const database = client.database(databaseId);

const container = database.container(containerId);

router.get('/', async (req, res) => {
    if(req.query['BoardId'] != undefined) {
        const querySpec = {
            query: 'SELECT * from c WHERE c.BoardId="' + req.query['BoardId']+'"' 
        };

        console.log(querySpec);
        
        const { resources: items } = await container.items
            .query(querySpec)
            .fetchAll();

            res.send(JSON.stringify({
                board: items[0].board
            }));
    } else {
        var board = [];
        for(var i=0;i<9;i++){
            board.push([]);
            for(var j=0;j<9;j++){
                board[i].push(Math.floor((Math.random() * 10)));
            }
        }
        const id = new Date().toJSON().replace(/-/g, '').replace(/:/g, '');
        const newItem = {
            BoardId: id,
            board: board
        };
        const { resource: createdItem } = 
            await container.items.create(newItem)
                .then(response => {
                    res.send(JSON.stringify({
                        board: board
                    }));
                }).catch(ex =>{ console.log(ex)});
    }
    
})

module.exports = router;