import * as express from "express";

import * as bodyParser from "body-parser";

import { asn1, md, pki } from "node-forge";

// Constants
const PORT = 3000;

// App
const app = express();

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (_, res) => {
  res.send(
    "Azure App Service test application (with client certificate) using nodejs"
  );
});

app.get("/headers", (req, res) => {
  res.json({
    headers: req.headers
  });
});

app.get("/clientcertificate", (req, res) => {
  const clientCertificateHeader = req.headers["x-arr-clientcert"];

  if (clientCertificateHeader !== null && clientCertificateHeader !== "") {
    const pem = `-----BEGIN CERTIFICATE-----${clientCertificateHeader}-----END CERTIFICATE-----`;
    const incomingCert = pki.certificateFromPem(pem);
    const fingerprint = pki.getPublicKeyFingerprint(incomingCert.publicKey, {
      encoding: "hex"
    });

    res.json({
      base64: clientCertificateHeader,
      fingerprint
    });
  }

  res.status(400).json({
    error: "No client certificate"
  });
});

app.get("/throw", (_, __) => {
  throw new Error("You call me!");
});

const port = process.env.PORT || PORT;
app.listen(port);
