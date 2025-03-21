import { 
    collection, 
    addDoc, 
    query, 
    where, 
    orderBy, 
    limit, 
    getDocs,
    doc,
    getDoc,
    updateDoc,
    DocumentData,
    serverTimestamp
  } from 'firebase/firestore';
  import { db } from './firebase';
  import { GameResult, PlayerStats, GameMode, Difficulty, LeaderboardEntry } from '../types/game';
  
  class GameService {
    async saveGameResult(playerName: string, result: GameResult) {
      try {
        const docRef = await addDoc(collection(db, 'gameResults'), {
          playerName,
          ...result,
          completedAt: serverTimestamp()
        });
        return docRef.id;
      } catch (error) {
        console.error('Error saving game result:', error);
        throw error;
      }
    }
      
    async getLeaderboard(difficulty: Difficulty, limitCount = 10): Promise<LeaderboardEntry[]> {
      try {
        const q = query(
          collection(db, 'gameResults'),
          where('difficulty', '==', difficulty),
          where('gameMode', '==', GameMode.Normal),
          limit(limitCount)
        );
      
        const snapshot = await getDocs(q);
        const results = snapshot.docs.map(doc => ({
          id: doc.id,
          playerName: doc.data().playerName,
          difficulty: doc.data().difficulty,
          moves: doc.data().moves,
          time: doc.data().time,
          completedAt: doc.data().completedAt?.toDate() || new Date(),
          optimalMoves: doc.data().optimalMoves,
          moveEfficiency: doc.data().moveEfficiency,
          gameMode: doc.data().gameMode
        }));
    
        // Sort first by moves, then by time
        return results.sort((a, b) => {
          if (a.moves !== b.moves) {
            return a.moves - b.moves;
          }
          return a.time - b.time;
        });
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
      }
    }
  
    async getPlayerStats(playerName: string): Promise<PlayerStats | null> {
      const q = query(
        collection(db, 'players'),
        where('name', '==', playerName),
        limit(1)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.empty ? null : snapshot.docs[0].data() as PlayerStats;
    }
  
    async getOrCreatePlayer(playerName: string) {
      const playerQuery = query(
        collection(db, 'players'),
        where('name', '==', playerName),
        limit(1)
      );
  
      const snapshot = await getDocs(playerQuery);
      if (!snapshot.empty) {
        return snapshot.docs[0];
      }
  
      return await addDoc(collection(db, 'players'), {
        name: playerName,
        recentGames: [],
        skillLevel: 1,
        currentDifficulty: Difficulty.Easy
      });
    }
  
    async updatePlayerStats(playerId: string, result: GameResult) {
      const playerRef = doc(db, 'players', playerId);
      const playerSnapshot = await getDoc(playerRef);
      const playerData = playerSnapshot.data() as PlayerStats;
  
      const newRecentGames = [
        result,
        ...playerData.recentGames.slice(0, 9)
      ];
  
      const avgEfficiency = newRecentGames.reduce(
        (sum, game) => sum + game.moveEfficiency, 
        0
      ) / newRecentGames.length;
  
      const newSkillLevel = Math.min(
        5,
        Math.max(1, Math.floor(avgEfficiency * 5))
      );
  
      await updateDoc(playerRef, {
        recentGames: newRecentGames,
        skillLevel: newSkillLevel,
        currentDifficulty: this.calculateNewDifficulty(newSkillLevel)
      });
    }
  
    calculateNewDifficulty(skillLevel: number): Difficulty {
      switch (skillLevel) {
        case 1: return Difficulty.Easy;
        case 2: return Difficulty.Medium;
        case 3: return Difficulty.Hard;
        case 4: return Difficulty.Expert;
        case 5: return Difficulty.Master;
        default: return Difficulty.Easy;
      }
    }
  }
  
  export const gameService = new GameService();