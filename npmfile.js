const express = require('express'); // Or another HTTP server library
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.post('/submit', express.urlencoded({ extended: true }), async (req, res) => {
	const token = process.env.GTOKEN;

	const {
		attending,
		drinks,
		firstname,
		surname,
		dietary,
		dish,
		security
	} = req.body;

	// Lowercase and trim the user's answer
    const answer = (security || '').trim().toLowerCase();

    // Define accepted answers (in lowercase)
    const validAnswers = ['webster', 'james']; // adjust as needed

    if (!validAnswers.includes(answer)) {
        return res.status(403).json({
            success: false,
            error: 'Security answer is incorrect.'
        });
    }


	const payload = {
		secret: token,
		firstname,
		surname,
		attending,
		dietary,
		dish,
		drinks
	};

	try {
		const result = await fetch('https://script.google.com/macros/s/AKfycbw2QqiWj6247hOH-7mbKIyOkZe3Kp_HA98McuebVLGfw1PRbKKE6x49b258KsToQRmW/exec', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});

        const data = await result.text();
	    console.log('Response from Google Script:', data);

		res.json({ success: true, message: 'Submitted successfully' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, error: 'Submission failed' });
	}
});


exports.printMsg = function() {
    console.log("Visit https://evejoewedding.com !");
};