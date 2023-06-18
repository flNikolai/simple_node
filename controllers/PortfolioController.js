import PortfolioModel from "../models/Portfolio.js";

export const getAll = async (req, res) => {
  try {
    const portfolio = await PortfolioModel.find()
      .populate("user", "_id fullName email")
      .exec();
    res.json({
      success: true,
      portfolio,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      msg: "Не удалось получить портфолио",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const portfolioId = req.params.id;

    await PortfolioModel.findOneAndUpdate(
      {
        _id: portfolioId,
      },
      {
        $inc: {
          viewsCount: 1,
        },
      },
      {
        returnDocument: "after",
      }
    )
      .populate("user", "_id fullName email")
      .exec()
      .then((doc, err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: false,
            msg: "Не удалось вернуть портфолио",
          });
        }

        if (!doc) {
          return res.status(404).json({
            success: false,
            msg: "Портфолио не найдено",
          });
        }

        res.json({
          success: true,
          doc,
        });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      msg: "Не удалось получить портфолио",
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PortfolioModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
      user: req.userId,
    });

    const portfolio = await doc.save();

    res.json({
      success: true,
      portfolio,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      msg: "Не удалось создать портфолио",
    });
  }
};

export const update = async (req, res) => {
  try {
    const portfolioId = req.params.id;

    await PortfolioModel.updateOne(
      {
        _id: portfolioId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        tags: req.body.tags,
        imageUrl: req.body.imageUrl,
        user: req.userId,
      }
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      msg: "Не удалось обновить портфолио",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const portfolioId = req.params.id;

    PortfolioModel.findByIdAndDelete({
      _id: portfolioId,
    }).then((doc, err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          msg: "Не удалось удалить портфолио",
        });
      }

      if (!doc) {
        return res.status(404).json({
          success: false,
          msg: "Портфолио не найдено",
        });
      }

      res.json({
        success: true,
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      msg: "Не удалось удалить портфолио",
    });
  }
};
