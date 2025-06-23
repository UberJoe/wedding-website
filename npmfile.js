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
	const {
		attending,
		drinks,
		firstname,
		surname,
		dietary,
		dish,
		security,
		email
	} = req.body;

	const answer = (security || '').trim().toLowerCase();
	const validAnswers = ['webster', 'james'];

	// Validate required fields
	if (!firstname || !surname) {
	return res.status(400).json({ success: false, error: 'Name is required.' });
	}

	if (!attending || !['yes', 'no'].includes(attending)) {
	return res.status(400).json({ success: false, error: 'Attendance must be yes or no.' });
	}

	if (!drinks || !['yes', 'no'].includes(drinks)) {
	return res.status(400).json({ success: false, error: 'Drinks must be yes or no.' });
	}

	if (!dish || typeof dish !== 'string' || dish.length < 5) {
	return res.status(400).json({ success: false, error: 'Please select a valid dish.' });
	}

	if (!validAnswers.includes(answer)) {
	return res.status(403).json({ success: false, error: 'Security answer is incorrect.' });
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!email || !emailRegex.test(email.trim())) {
		return res.status(400).json({ success: false, error: 'Invalid email address.' });
	}

	const cleanEmail = email.trim();
	const cleanFirst = firstname.trim();
	const cleanLast = surname.trim();
	const cleanDiet = (dietary || '').trim();

	const payload = {
		secret: process.env.GTOKEN,
		firstname: cleanFirst,
		surname: cleanLast,
		email: cleanEmail,
		attending,
		dietary: cleanDiet,
		dish,
		drinks
	};

	try {
	const result = await fetch('https://script.google.com/macros/s/AKfycbyLLqb-OaGLnO7w2PCMsXvAI9v9fwmDNGBp_T3gB9Pqi_UtjmqihoSLcFzV_duLse-p/exec', {
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