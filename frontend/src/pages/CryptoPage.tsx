import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Stack,
    TextField,
    Button,
    Checkbox,
    FormControlLabel
} from '@mui/material';
import { useWallet } from '../contexts/WalletContext';

function CryptoPage() {
    const { wallet } = useWallet();

    // Encryption / Decryption
    const [plaintext, setPlaintext] = useState('');
    const [ciphertextHex, setCiphertextHex] = useState('');
    const [encryptResult, setEncryptResult] = useState('');
    const [decryptResult, setDecryptResult] = useState('');

    const [cryptoProtocol, setCryptoProtocol] = useState('encryption-protocol');
    const [cryptoSecurityLevel, setCryptoSecurityLevel] = useState(1);
    const [cryptoKeyID, setCryptoKeyID] = useState('encrypt-key');
    const [cryptoCounterparty, setCryptoCounterparty] = useState('anyone');
    const [privileged, setPrivileged] = useState(false);

    const handleEncrypt = async () => {
        if (!wallet) return;
        const dataBytes = stringToBytes(plaintext);
        try {
            const resp = await wallet.encrypt({
                plaintext: dataBytes,
                protocolID: [cryptoSecurityLevel, cryptoProtocol],
                keyID: cryptoKeyID,
                counterparty: cryptoCounterparty,
                privileged
            });
            setEncryptResult(bytesToHex(resp.ciphertext));
        } catch (err) {
            console.error(err);
        }
    };

    const handleDecrypt = async () => {
        if (!wallet) return;
        const ct = parseHexString(ciphertextHex);
        try {
            const resp = await wallet.decrypt({
                ciphertext: ct,
                protocolID: [cryptoSecurityLevel, cryptoProtocol],
                keyID: cryptoKeyID,
                counterparty: cryptoCounterparty,
                privileged
            });
            setDecryptResult(bytesToString(resp.plaintext));
        } catch (err) {
            console.error(err);
        }
    };

    // HMAC
    const [hmacData, setHmacData] = useState('');
    const [hmacResult, setHmacResult] = useState('');
    const [verifyHmacText, setVerifyHmacText] = useState('');
    const [verifyHmacOutput, setVerifyHmacOutput] = useState('');

    const handleCreateHmac = async () => {
        if (!wallet) return;
        const dataBytes = stringToBytes(hmacData);
        try {
            const resp = await wallet.createHmac({
                data: dataBytes,
                protocolID: [cryptoSecurityLevel, cryptoProtocol],
                keyID: cryptoKeyID,
                counterparty: cryptoCounterparty,
                privileged
            });
            setHmacResult(bytesToHex(resp.hmac));
        } catch (err) {
            console.error(err);
        }
    };

    const handleVerifyHmac = async () => {
        if (!wallet) return;
        const dataBytes = stringToBytes(hmacData);
        const hmacBytes = parseHexString(verifyHmacText);
        try {
            const resp = await wallet.verifyHmac({
                data: dataBytes,
                hmac: hmacBytes,
                protocolID: [cryptoSecurityLevel, cryptoProtocol],
                keyID: cryptoKeyID,
                counterparty: cryptoCounterparty,
                privileged
            });
            setVerifyHmacOutput(resp.valid ? 'VALID HMAC' : 'INVALID HMAC');
        } catch (err) {
            console.error(err);
        }
    };

    // Sign / Verify
    const [signData, setSignData] = useState('');
    const [signatureHex, setSignatureHex] = useState('');
    const [signResult, setSignResult] = useState('');
    const [verifyOutput, setVerifyOutput] = useState('');

    const handleSign = async () => {
        if (!wallet) return;
        const dataBytes = stringToBytes(signData);
        try {
            const resp = await wallet.createSignature({
                data: dataBytes,
                protocolID: [cryptoSecurityLevel, cryptoProtocol],
                keyID: cryptoKeyID,
                counterparty: cryptoCounterparty,
                privileged
            });
            setSignResult(bytesToHex(resp.signature));
        } catch (err) {
            console.error(err);
        }
    };

    const handleVerify = async () => {
        if (!wallet) return;
        const dataBytes = stringToBytes(signData);
        const sigBytes = parseHexString(signatureHex);
        try {
            const resp = await wallet.verifySignature({
                data: dataBytes,
                signature: sigBytes,
                protocolID: [cryptoSecurityLevel, cryptoProtocol],
                keyID: cryptoKeyID,
                counterparty: cryptoCounterparty,
                privileged
            });
            setVerifyOutput(resp.valid ? 'VALID SIGNATURE' : 'INVALID SIGNATURE');
        } catch (err) {
            console.error(err);
        }
    };

    function stringToBytes(str: string): number[] {
        return Array.from(new TextEncoder().encode(str));
    }
    function bytesToString(bytes: number[]): string {
        return new TextDecoder().decode(new Uint8Array(bytes));
    }
    function parseHexString(hex: string): number[] {
        const clean = hex.replace(/^0x/, '').replace(/[^0-9a-fA-F]/g, '');
        const result: number[] = [];
        for (let i = 0; i < clean.length; i += 2) {
            result.push(parseInt(clean.substr(i, 2), 16));
        }
        return result;
    }
    function bytesToHex(arr: number[]): string {
        return arr.map((b) => b.toString(16).padStart(2, '0')).join('');
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Crypto</Typography>
            <Paper sx={{ p: 2, mb: 2 }}>
                <Stack direction="row" spacing={2}>
                    <TextField
                        label="Protocol"
                        value={cryptoProtocol}
                        onChange={(e) => setCryptoProtocol(e.target.value)}
                    />
                    <TextField
                        label="SecLevel"
                        type="number"
                        value={cryptoSecurityLevel}
                        onChange={(e) => setCryptoSecurityLevel(parseInt(e.target.value, 10))}
                        sx={{ width: 100 }}
                    />
                    <TextField
                        label="KeyID"
                        value={cryptoKeyID}
                        onChange={(e) => setCryptoKeyID(e.target.value)}
                    />
                    <TextField
                        label="Counterparty"
                        value={cryptoCounterparty}
                        onChange={(e) => setCryptoCounterparty(e.target.value)}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={privileged}
                                onChange={(e) => setPrivileged(e.target.checked)}
                            />
                        }
                        label="Privileged?"
                    />
                </Stack>
            </Paper>

            <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6">Encrypt / Decrypt</Typography>
                <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
                    <TextField
                        label="Plaintext"
                        value={plaintext}
                        onChange={(e) => setPlaintext(e.target.value)}
                    />
                    <Stack direction="row" spacing={2}>
                        <Button variant="contained" onClick={handleEncrypt}>
                            Encrypt
                        </Button>
                        <Typography>Result (hex): {encryptResult}</Typography>
                    </Stack>
                    <TextField
                        label="Ciphertext (hex)"
                        value={ciphertextHex}
                        onChange={(e) => setCiphertextHex(e.target.value)}
                    />
                    <Stack direction="row" spacing={2}>
                        <Button variant="contained" onClick={handleDecrypt}>
                            Decrypt
                        </Button>
                        <Typography>Result (plaintext): {decryptResult}</Typography>
                    </Stack>
                </Stack>
            </Paper>

            <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6">HMAC</Typography>
                <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
                    <TextField
                        label="Data for HMAC"
                        value={hmacData}
                        onChange={(e) => setHmacData(e.target.value)}
                    />
                    <Stack direction="row" spacing={2}>
                        <Button variant="contained" onClick={handleCreateHmac}>
                            Create HMAC
                        </Button>
                        <Typography>HMAC (hex): {hmacResult}</Typography>
                    </Stack>
                    <TextField
                        label="HMAC to verify (hex)"
                        value={verifyHmacText}
                        onChange={(e) => setVerifyHmacText(e.target.value)}
                    />
                    <Stack direction="row" spacing={2}>
                        <Button variant="contained" onClick={handleVerifyHmac}>
                            Verify HMAC
                        </Button>
                        <Typography>{verifyHmacOutput}</Typography>
                    </Stack>
                </Stack>
            </Paper>

            <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6">Sign / Verify</Typography>
                <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
                    <TextField
                        label="Data to Sign"
                        value={signData}
                        onChange={(e) => setSignData(e.target.value)}
                    />
                    <Stack direction="row" spacing={2}>
                        <Button variant="contained" onClick={handleSign}>
                            Sign
                        </Button>
                        <Typography>Signature (hex): {signResult}</Typography>
                    </Stack>
                    <TextField
                        label="Signature to Verify (hex)"
                        value={signatureHex}
                        onChange={(e) => setSignatureHex(e.target.value)}
                    />
                    <Stack direction="row" spacing={2}>
                        <Button variant="contained" onClick={handleVerify}>
                            Verify
                        </Button>
                        <Typography>{verifyOutput}</Typography>
                    </Stack>
                </Stack>
            </Paper>
        </Box>
    );
}

export default CryptoPage;
