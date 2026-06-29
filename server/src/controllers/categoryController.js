const Category = require('../models/Category');
const Transaction = require('../models/Transaction');

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ user: req.user._id }).sort('name');
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const category = await Category.create({ ...req.body, user: req.user._id });
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!category) return res.status(404).json({ error: 'Category not found' });
    await Transaction.deleteMany({ category: category._id });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
};
