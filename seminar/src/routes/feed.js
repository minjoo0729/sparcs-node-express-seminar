const express = require('express');
//const FeedModel = require('../models/feed');
const router = express.Router();

class FeedDB {
    static _inst_;
    static getInst = () => {
        if ( !FeedDB._inst_ ) FeedDB._inst_ = new FeedDB();
        return FeedDB._inst_;
    }

    #id = 0; #itemCount = 0; #LDataDB = [];

    constructor() { console.log("[Feed-DB] DB Init Completed"); }

    selectItems = ( count ) => {
        try {
            // We'll Remove the Item Count Limit for Search... (Really, this is unnecessary)
            
            // const DBItemCount = await FeedModel.countDocuments();
            if (count > this.#itemCount) return { success: false, data: "Too many items queried"  };
            if (count < 0) return { success: false, data: "Invalid count provided" };
            else return { success: true, data: this.#LDataDB.slice(0, count) };

        } catch (e) {
            console.log(`[Feed-DB] Select Error: ${ e }`);
            return { success: false, data: `DB Error - ${ e }` };
        }
    }

    insertItem = ( item ) => {
        try {
            console.log(item);
            const { title, content } = item;
            this.#LDataDB.push({ id: this.#id, title, content });
            this.#id++;
            this.#itemCount++;
            return true;
        } catch (e) {
            console.log(`[Feed-DB] Insert Error: ${ e }`);
            return false;
        }
    }

    deleteItem = ( id ) => {
        try {
            let BItemDeleted = false;
            this.#LDataDB = this.#LDataDB.filter((value) => {
                const match = (value.id === id);
                if (match) BItemDeleted = true;
                return !match;
            });
            if (BItemDeleted){
                id--;
            }
            return BItemDeleted;
        } catch (e) {
            console.log(`[Feed-DB] Delete Error: ${ e }`);
            return false;
        }
    }

    editItem = ( item ) => {
        try {
            const {id, title, content} = item;
            let BItemDeleted = false;
            this.#LDataDB = this.#LDataDB.map((value) => {
                if (value.id === id){
                    BItemEdited = true;
                    return {id: id, title: title, content: content};
                }else{
                    return value;
                }
            });
            console.log(this.#LDataDB);
            return BItemEdited;
        } catch (e) {
            console.log(`[Feed-DB] Delete Error: ${ e }`);
            return false;
        }
    }
}

const feedDBInst = FeedDB.getInst();

router.get('/getFeed', async (req, res) => {
    try {
        const requestCount = parseInt(req.query.count);
        const dbRes = feedDBInst.selectItems(requestCount, searchString);
        if (dbRes.success) return res.status(200).json(dbRes.data);
        else return res.status(500).json({ error: dbRes.data })
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

router.post('/addFeed', (req, res) => {
   try {
       const { title, content } = req.body;
       const addResult = feedDBInst.insertItem({ title, content });
       if (!addResult) return res.status(500).json({ error: dbRes.data })
       else return res.status(200).json({ isOK: true });
   } catch (e) {
       return res.status(500).json({ error: e });
   }
});

router.post('/deleteFeed', (req, res) => {
    try {
        const { id } = req.body;
        const deleteResult = feedDBInst.deleteItem(parseInt(id));
        if (!deleteResult) return res.status(500).json({ error: "No item deleted" })
        else return res.status(200).json({ isOK: true });
    } catch (e) {
        return res.status(500).json({ error: e });
    }
})

router.post('/editFeed', (req, res) => {
    try {
        const { id, title, content } = req.body;
        const editResult = feedDBInst.editItem({id: parseInt(id), title, content});
        if (!editResult) return res.status(500).json({ error: "No item edited" })
        else return res.status(200).json({ isOK: true });
    } catch (e) {
        return res.status(500).json({ error: e });
    }
})

module.exports = router;