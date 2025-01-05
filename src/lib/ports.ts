const ports: {[key: number]: String;} = {
	80: "HTTP",
	443: "HTTPS",
	22: "SSH",
	21: "FTP",
	25: "unsecure SMTP",
	110: "unsecure POP3",
	143: "unsecure IMAP",
	465: "secure SMTP",
	995: "secure POP3",
	993: "secure IMAP",
	53: "DNS",
	67: "DHCP",
}

export default ports;

export const unsafeToForwardToInternet = [
	6379,
	3306
];

export const unsafeToAllow = [
	25,
	110,
	143,
	22
]