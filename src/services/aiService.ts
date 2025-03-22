import { Towers, Move } from "../types/game";

class AiService {
    private apiKey: string;
    private endpoint: string;
    private model: string;
  
    constructor() {
      this.apiKey = process.env.REACT_APP_GPT4_MINI_API_KEY || '';
      this.endpoint = process.env.REACT_APP_API_ENDPOINT || '';
      this.model = process.env.REACT_APP_GPT4_MINI_MODEL || '';
      console.log('AI Service Initialized:', {
        endpoint: this.endpoint,
        hasKey: !!this.apiKey,
        model: this.model
      });
    }

    private isValidMove(towers: Towers, fromTower: number, toTower: number): boolean {
        // Check if source tower has disks
        if (towers[fromTower].length === 0) return false;
        
        const movingDisk = towers[fromTower][towers[fromTower].length - 1];
        const targetTower = towers[toTower];
        
        // Check if target tower is empty or if moving disk is smaller
        if (targetTower.length === 0) return true;
        return movingDisk < targetTower[targetTower.length - 1];
    }

  
    async getNextMove(towers: Towers): Promise<Move | null> {
        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [{
                        role: "system",
                        content: `You are a Towers of Hanoi solving assistant. Follow these rules:
                        1. Only move one disk at a time
                        2. A larger disk cannot be placed on a smaller disk
                        3. Only move the top disk from any tower
                        4. Respond ONLY with a JSON object: {"fromTower": number, "toTower": number, "disk": number}
                        5. Towers are indexed 0-2 from left to right
                        6. The disk number represents its size (larger number = larger disk)
                        7. Your goal is to move all disks to the rightmost tower
                        8. Complete the game in the fewest moves possible`
                    }, {
                        role: "user",
                        content: `Current tower state: ${JSON.stringify(towers)}. Provide the next optimal move considering the rules.`
                    }],
                    temperature: 0
                })
            });
    
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }
    
            const data = await response.json();
            const move = this.parseAIResponse(data.choices[0].message.content);
    
            // Enhanced move validation
            if (move && this.isValidMove(towers, move.fromTower, move.toTower)) {
                const sourceDisk = towers[move.fromTower][towers[move.fromTower].length - 1];
                move.disk = sourceDisk; // Ensure disk size matches actual tower state
                return move;
            }
    
            console.error('Invalid or illegal move suggested by AI');
            return null;
        } catch (error) {
            console.error('AI service error:', error);
            return null;
        }
    }
  
  private parseAIResponse(content: string): Move | null {
    try {
        const move = JSON.parse(content);
        const fromTower = move.fromTower ?? move.from;
        const toTower = move.toTower ?? move.to;
        
        if (
            typeof fromTower === 'number' && 
            typeof toTower === 'number' &&
            fromTower >= 0 && fromTower <= 2 &&
            toTower >= 0 && toTower <= 2 &&
            fromTower !== toTower
        ) {
            return {
                fromTower,
                toTower,
                disk: move.disk ?? null
            };
        }
        return null;
    } catch (error) {
        return null;
    }
}
}

const aiService = new AiService();
export { aiService };