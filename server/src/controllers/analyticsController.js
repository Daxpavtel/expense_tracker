const Transaction = require('../models/Transaction');

exports.monthlySummary = async (req, res, next) => {
  try {
    const { year, month } = req.query;
    const y = Number(year) || new Date().getFullYear();
    const m = month ? Number(month) - 1 : new Date().getMonth();
    const start = new Date(y, m, 1);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);

    const match = { user: req.user._id, date: { $gte: start, $lt: end } };

    const summary = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const byCategory = await Transaction.aggregate([
      { $match: match },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'cat',
        },
      },
      { $unwind: '$cat' },
      {
        $group: {
          _id: { id: '$cat._id', name: '$cat.name', color: '$cat.color', icon: '$cat.icon' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const income = summary.find(s => s._id === 'income')?.total || 0;
    const expense = summary.find(s => s._id === 'expense')?.total || 0;

    res.json({
      start,
      end,
      income,
      expense,
      balance: income - expense,
      byCategory,
    });
  } catch (err) {
    next(err);
  }
};

exports.yearlySummary = async (req, res, next) => {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);

    const monthly = await Transaction.aggregate([
      { $match: { user: req.user._id, date: { $gte: start, $lt: end } } },
      {
        $group: {
          _id: { month: { $month: '$date' }, type: '$type' },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.month': 1 } },
    ]);

    const byCategory = await Transaction.aggregate([
      { $match: { user: req.user._id, date: { $gte: start, $lt: end } } },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'cat',
        },
      },
      { $unwind: '$cat' },
      {
        $group: {
          _id: { name: '$cat.name', color: '$cat.color', icon: '$cat.icon', type: '$type' },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const totalIncome = await Transaction.aggregate([
      { $match: { user: req.user._id, type: 'income', date: { $gte: start, $lt: end } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalExpense = await Transaction.aggregate([
      { $match: { user: req.user._id, type: 'expense', date: { $gte: start, $lt: end } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    res.json({
      year,
      income: totalIncome[0]?.total || 0,
      expense: totalExpense[0]?.total || 0,
      balance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
      monthly,
      byCategory,
    });
  } catch (err) {
    next(err);
  }
};
