const Table = require ('../models/Table');

exports.createTable = async(req, res) => {
    try{
        const table =  await Table.create(req.body);
        res.status(201).json(table)
    } catch(err){
        res.status(500).json({ message:'Lỗi server', error: err.message });
    }
};

exports.getTables = async(req, res) => {
    try {
        const tables = await Table.find();
        res.json(tables)
    } catch (err) {
        res.status(500).json({message: ' Lỗi server', error: err.message });
    }
};

exports.getTable = async(req, res) => {
    try {
        const table = await Table.findById(req.params.id);
        if(!table) return res.status(404).json({ message: 'Không tìm thấy bàn'})
        res.json(table)
    } catch (err) {
        res.status(500).json({message: 'Lỗi server'});
    }
};

exports.updateTable = async(req, res) => {
    try {
        const table = await Table.findByIdAndUpdate(req.params.id, req.body, {new: true})
        res.json(table);
    } catch (err) {
        res.status(500).json({message: 'Lỗi server'})
    }
};

exports.deleteTable = async (req, res) => {
    try {
        const table = await Table.findOneAndDelete(req.params.id);
        res.json(table)
    } catch (err) {
        res.status(500).json({message: 'Lỗi server'})
    }
}