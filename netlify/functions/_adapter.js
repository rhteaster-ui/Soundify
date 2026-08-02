// Wraps the existing Express-style handlers in api/*.js (which expect
// (req, res) with req.query/req.body and res.status().json()/send()/setHeader())
// so they can run unmodified as Netlify Functions.

function buildReqRes(event) {
    const req = {
        method: event.httpMethod,
        query: event.queryStringParameters || {},
        body: event.body,
        headers: event.headers || {}
    };

    const res = {
        statusCode: 200,
        _headers: {},
        _body: '',
        setHeader(key, value) { this._headers[key] = value; return this; },
        status(code) { this.statusCode = code; return this; },
        json(obj) {
            this._headers['Content-Type'] = 'application/json';
            this._body = JSON.stringify(obj);
            return this;
        },
        send(data) {
            this._body = typeof data === 'string' ? data : JSON.stringify(data);
            return this;
        },
        end(data) {
            if (data !== undefined) this._body = data;
            return this;
        }
    };

    return { req, res };
}

function wrap(handler) {
    return async (event) => {
        const { req, res } = buildReqRes(event);
        try {
            await handler(req, res);
        } catch (err) {
            return {
                statusCode: 500,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: false, message: 'Internal error: ' + err.message })
            };
        }
        return {
            statusCode: res.statusCode || 200,
            headers: res._headers,
            body: res._body || ''
        };
    };
}

module.exports = { wrap };
