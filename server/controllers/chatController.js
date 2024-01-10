const openAI = require("openai");

const UserData = require("../models/dataModel");

const Heading = require("../models/heading");

const Subheading = require("../models/subheading");

const Feedback = require("../models/feedback");

require("dotenv").config();

const data = require("../util/data");

exports.getHeadingsWithSubheadings = async (req, res) => {
  try {
      const headingsWithSubheadings = await Heading.aggregate([
          {
              $lookup: {
                  from: 'subheadings',
                  localField: '_id',
                  foreignField: 'heading',
                  as: 'subheadings'
              }
          }
      ]);

      res.status(200).json({
          headings: headingsWithSubheadings
      });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};


exports.postChat = async (req, res) => {
  try {
    const newInput = req.body.chat;

    const openai = new openAI({
      apiKey: process.env.OPEN_AI_API_KEY,
    });

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: data + newInput }],
      max_tokens: 200,
    });

    const userData = new UserData({
      question: newInput,
      answer: chatCompletion.choices[0].message.content,
    });

    await userData.save();
    res.status(200).json({ message: chatCompletion.choices[0].message });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong" });
  }
};

exports.postSubheading = async (req, res, next) => {
  try {
    const { heading, subheadings } = req.body;

    const newHeading = new Heading({
      title: heading,
    });

    const savedHeading = await newHeading.save();

    const subheadingPromises = subheadings.map(async (subheading) => {
      const newSubheading = new Subheading({
        title: subheading.title,
        content: subheading.content,
        heading: savedHeading._id,
      });
      return await newSubheading.save();
    });

    const savedSubheadings = await Promise.all(subheadingPromises);

    res.status(201).json({
      message: "Heading and subheadings created successfully",
      heading: savedHeading,
      subheadings: savedSubheadings,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getHeadings = async (req, res) => {
  try {
    const headings = await Heading.find({});
    res.status(200).json({ headings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSubheadings = async (req, res) => {
  try {
    const { headingId } = req.params;
    const subheadings = await Subheading.find({ headingId });
    res.status(200).json({ subheadings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const ITEMS_PER_PAGE = 10;
exports.getAllResponses = async (req, res) => {
  const page = +req.query.page || 1;

  try {
    const totalResponses = await UserData.countDocuments({});
    const totalPages = Math.ceil(totalResponses / ITEMS_PER_PAGE);

    const responses = await UserData.find({})
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    res.status(200).json({
      responses,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.postFeedback = async (req, res) => {
  try {
    const { feedbackMessage, userDataId } = req.body;

    const newFeedback = new Feedback({
      feedbackMessage,
      userData: userDataId,
    });

    const savedFeedback = await newFeedback.save();

    res.status(201).json({
      message: "Feedback saved successfully",
      feedback: savedFeedback,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
