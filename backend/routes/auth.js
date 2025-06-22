import express from "express";
import axios from "axios";
import { ConfidentialClientApplication } from "@azure/msal-node";
import { generateToken, authenticateToken } from "../middleware/auth.js";
import User from "../models/User.js";

let msalInstance = null;

const getMsalInstance = () => {
  if (!msalInstance) {
    const msalConfig = {
      auth: {
        clientId: process.env.AZURE_CLIENT_ID,
        clientSecret: process.env.AZURE_CLIENT_SECRET,
        authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
      },
    };

    msalInstance = new ConfidentialClientApplication(msalConfig);
  }
  return msalInstance;
};

const getAuthUrl = async () => {
  const authCodeUrlParameters = {
    scopes: ["openid", "profile", "User.Read"],
    redirectUri: process.env.AZURE_REDIRECT_URI,
    prompt: "login",
  };

  return getMsalInstance().getAuthCodeUrl(authCodeUrlParameters);
};

const router = express.Router();

router.get("/azure/login", async (req, res) => {
  try {
    const authUrl = await getAuthUrl();
    res.json({ authUrl });
  } catch (error) {
    console.error(
      "Erreur lors de la génération de l'URL d'authentification:",
      error
    );
    res.status(500).json({
      error: "Erreur lors de la génération de l'URL d'authentification",
    });
  }
});

router.post("/azure/callback", async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Code d'autorisation manquant" });
  }

  try {
    const tokenRequest = {
      code,
      scopes: ["openid", "profile", "User.Read"],
      redirectUri: process.env.AZURE_REDIRECT_URI,
    };
    const response = await getMsalInstance().acquireTokenByCode(tokenRequest);
    const userInfo = await getUserInfoFromGraph(response.accessToken);
    const userEmail = userInfo.mail || userInfo.userPrincipalName;

    let user = await User.findOne({
      $or: [{ azureId: userInfo.id }, { email: userEmail }],
    });

    if (!user) {
      user = new User({
        azureId: userInfo.id,
        email: userEmail,
        firstName: userInfo.givenName,
        lastName: userInfo.surname,
      });
      await user.save();
    } else {
      if (user.azureId !== userInfo.id) {
        user.azureId = userInfo.id;
      }
      user.firstName = userInfo.givenName;
      user.lastName = userInfo.surname;
      user.lastLogin = new Date();

      await user.save();
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error("Stack trace:", error.stack);
    res.status(500).json({
      error: "Erreur lors de l'authentification",
      details: error.message,
    });
  }
});

router.get("/me", authenticateToken, (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      createdAt: req.user.createdAt,
      lastLogin: req.user.lastLogin,
    },
  });
});

router.post("/logout", authenticateToken, (req, res) => {
  res.json({ message: "Déconnexion réussie" });
});

async function getUserInfoFromGraph(accessToken) {
  try {
    const response = await axios.get("https://graph.microsoft.com/v1.0/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return {
      ...response.data,
    };
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des informations utilisateur:",
      error
    );
    throw error;
  }
}

export default router;
