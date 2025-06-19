import express from "express";
import {
  upload,
  createTeam,
  deleteTeam,
  getAllTeams,
  getTeamById,
  getTeamsByUserId,
  getTeamsByDesignation,
} from "../controllers/teamControler.js";
import authMiddleware from "../middleware/authMiddlware.js";

const router = express.Router();

router.post("/add", upload.single("team_dp"), authMiddleware, createTeam);
router.get("/", authMiddleware, getAllTeams);
router.delete("/:id", authMiddleware, deleteTeam);
router.get("/:id", authMiddleware, getTeamById);
router.get("/user/:userId", authMiddleware, getTeamsByUserId);
router.get(
  "/by-designation/:designation",
  authMiddleware,
  getTeamsByDesignation
);

export default router;
