const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { validationResult, matchedData } = require('express-validator')
const Category = require('../models/Category')
const User = require('../models/User')
const State = require('../models/State')
const Ad = require('../models/Ad')

module.exports = {
  getCategories: async (req, res) => {
    const cats = await Category.find()
    let categories = []

    for(let i in cats) {
      categories.push({
        id: cats[i]._id,
        name: cats[i].name,
        slug: cats[i].slug,
        image: `${process.env.BASE}/assets/images/${cats[i].slug}.png`,
      })
    }

    res.json({ categories: categories })
  },
  addAction: async (req, res) => {

  },
  getList: async (req, res) => {

  },
  getItem: async (req, res) => {

  },
  editAction: async (req, res) => {

  }
}