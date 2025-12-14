const Idea = require("../models/Idea");
const openai = require("../utils/openai");

// CREATE IDEA + AI ANALYSIS
exports.createIdea = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description required" });
    }

    // AI Prompt
    const prompt = `
You are an expert startup consultant.
Analyze the given startup idea and return a structured JSON object with the fields:
problem, customer, market, competitor, tech_stack, risk_level, profitability_score, justification.

Rules:
- Keep answers concise and realistic
- competitor must contain exactly 3 competitors with one-line differentiation each
- tech_stack must list 4–6 practical technologies for MVP
- profitability_score must be an integer between 0–100
- Return ONLY valid JSON, no explanations

Input:
{
  "title": "${title}",
  "description": "${description}"
}
`;

    // OpenAI Call
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6
    });

    const aiResponse = completion.choices[0].message.content;

    // Parse AI JSON
    let analysis;
    try {
      analysis = JSON.parse(aiResponse);
    } catch (error) {
      return res.status(500).json({
        message: "Failed to parse AI response",
        rawResponse: aiResponse
      });
    }

    // Save to DB
    const idea = new Idea({
      title,
      description,
      analysis
    });

    await idea.save();

    res.status(201).json(idea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL IDEAS (Dashboard)
exports.getIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find().sort({ createdAt: -1 });
    res.json(ideas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE IDEA (Detail Page)
exports.getIdeaById = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }
    res.json(idea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE IDEA (Optional)
exports.deleteIdea = async (req, res) => {
  try {
    await Idea.findByIdAndDelete(req.params.id);
    res.json({ message: "Idea deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
