import express from "express";
import db from "@repo/db/client";
const app = express();

app.use(express.json());

app.post("/hdfcWebhook", async (req, res) => {
  const paymentInformation = {
    token: req.body.token,
    userId: req.body.user_identifier,
    amount: req.body.amount,
  };
  try {
    const user = await db.user.findUnique({
      where: {
        id: Number(paymentInformation.userId),
      },
    });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const userBalance = await db.balance.findUnique({
      where: {
        userId: Number(paymentInformation.userId),
      },
    });

    if (!userBalance) {
      await db.balance.create({
        data: {
          userId: Number(paymentInformation.userId),
          amount: Number(paymentInformation.amount),
          locked: 0,
        },
      });
    } else {
      await db.$transaction([
        db.balance.updateMany({
          where: {
            userId: Number(paymentInformation.userId),
          },
          data: {
            amount: {
              increment: Number(paymentInformation.amount),
            },
          },
        }),
        db.onRampTransaction.updateMany({
          where: {
            token: paymentInformation.token,
          },
          data: {
            status: "Success",
          },
        }),
      ]);
    }

    res.json({
      message: "Captured",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Error while processing webhook",
    });
  }
});

app.listen(3003, () => {
  console.log("Server is running on port 3003");
});
