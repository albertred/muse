// Import Express
const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const app = express();

app.use(express.static('../public')); 

app.get('/', (req, res) => {
    res.send('hi');
});

app.get('/api/message', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});

app.get('/api/content', (req, res) => {
    console.log("getting content!!");
})


app.get('/api/content', (req, res) => {
    res.send({})
})

app.delete("/api/delete/::id", (req, res) => {
    const id = +req.params.id;
    res.send({})
})

// Daily words endpoint using LangChain
app.get('/api/daily-words', (req, res) => {
    const pythonPath = path.join(__dirname, '../langchain/daily_word_generator.py');
    
    const pythonProcess = spawn('python', [pythonPath]);
    
    let output = '';
    let error = '';
    
    pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
        error += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
        if (code === 0) {
            // Parse the output to extract theme and words
            const lines = output.trim().split('\n');
            const themeLine = lines.find(line => line.includes("Today's theme:"));
            const wordsLine = lines.find(line => line.includes("Generated words:"));
            
            if (themeLine && wordsLine) {
                const theme = themeLine.replace("Today's theme:", "").trim();
                const wordsStr = wordsLine.replace("Generated words:", "").trim();
                const words = wordsStr.split(', ').map(word => word.trim());
                
                res.json({
                    success: true,
                    theme: theme,
                    words: words,
                    date: new Date().toISOString().split('T')[0]
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Failed to parse word generation output'
                });
            }
        } else {
            res.status(500).json({
                success: false,
                error: 'Word generation failed: ' + error
            });
        }
    });
})

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

