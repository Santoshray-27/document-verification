const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errorHandler } = require('./middleware/errors');

const authRoutes = require('./routes/auth');
const issuersRoutes = require('./routes/issuers');
const issueRoutes = require('./routes/issue');
const verifyRoutes = require('./routes/verify');
const publicRoutes = require('./routes/public');
const revokeRoutes = require('./routes/revoke');
const auditRoutes = require('./routes/audit');
const reportRoutes = require('./routes/report');

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/issuers', issuersRoutes);
app.use('/api/issue', issueRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/revoke', revokeRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/report', reportRoutes);

app.use((req, res) => res.status(404).json({ error: 'Not Found' }));
app.use(errorHandler);

module.exports = app;
