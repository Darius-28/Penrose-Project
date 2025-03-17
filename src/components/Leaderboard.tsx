import React from "react";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";
import { LeaderboardEntry } from "../types/game";

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  difficulty: number;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  entries,
  difficulty,
}) => {
  const getDifficultyName = (diff: number): string => {
    switch (diff) {
      case 3:
        return "Easy";
      case 4:
        return "Medium";
      case 5:
        return "Hard";
      case 6:
        return "Expert";
      case 7:
        return "Master";
      default:
        return "Unknown";
    }
  };

  return (
    <Paper
      sx={{
        width: "300px",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "primary.main",
        boxShadow: "0 0 20px #00e5ff",
        p: 2,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: "primary.main",
          textShadow: "0 0 10px #00e5ff",
          fontWeight: "bold",
          mb: 2,
          textAlign: "center",
        }}
      >
        Leaderboard - {getDifficultyName(difficulty)}
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "secondary.main" }}>#</TableCell>
              <TableCell sx={{ color: "secondary.main" }}>Player</TableCell>
              <TableCell sx={{ color: "secondary.main" }}>Time</TableCell>
              <TableCell sx={{ color: "secondary.main" }}>Moves</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map((entry, index) => (
              <TableRow key={entry.id || index}>
                <TableCell sx={{ color: "primary.main" }}>
                  {index + 1}
                </TableCell>
                <TableCell sx={{ color: "primary.main" }}>
                  {entry.playerName}
                </TableCell>
                <TableCell sx={{ color: "primary.main" }}>
                  {entry.time}s
                </TableCell>
                <TableCell sx={{ color: "primary.main" }}>
                  {entry.moves}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
