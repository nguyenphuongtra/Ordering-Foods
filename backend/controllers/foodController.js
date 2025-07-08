const Food  = require ('../models/Food');

exports.createFood = async(req, res) => {
    try{
        const food =  await Food.create(req.body);
        res.status(201).json(food)
    } catch(err){
        res.status(500).json({ message:'Lỗi server', error: err.message });
    }
};

exports.getFoods = async(req, res) => {
    try {
        const foods = await Food.find();
        res.json(foods)
    } catch (err) {
        res.status(500).json({message: ' Lỗi server', error: err.message });
    }
};

exports.getFood = async(req, res) => {
    try {
        const food = await Food.findById(req.params.id);
        if(!food) return res.status(404).json({ message: 'Không tìm thấy món ăn'})
        res.json(food)
    } catch (err) {
        res.status(500).json({message: 'Lỗi server'});
    }
};

exports.updateFood = async(req, res) => {
    try {
        const food = await Food.findByIdAndUpdate(req.params.id, req.body, {new: true})
        res.json(food);
    } catch (err) {
        res.status(500).json({message: 'Lỗi server'})
    }
}

exports.deleteFood = async (req, res) => {
    try {
        const food = await Food.findOneAndDelete(req.params.id);
        res.json(food)
    } catch (err) {
        res.status(500).json({message: 'Lỗi server'})
    }
}