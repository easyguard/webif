type PortUsage = {
	name: string;
	fullname: string;
	description: string;
	tags?: string[];
	alternatives?: `${number}/${"tcp" | "udp" | "icmp"}`[];
	important?: boolean;
}

const ports: {[key: string]: {[key: number | string]: PortUsage}} = {
	tcp: {
		80: { name: "HTTP", fullname: "Hypertext Transfer Protocol", description: "unencrypted web traffic", tags: ["insecure"], alternatives: ["443/tcp"] },
		21: { name: "FTP", fullname: "File Transfer Protocol", description: "(unencrypted)", tags: ["insecure"], alternatives: ["22/tcp"] },
		22: { name: "SSH", fullname: "Secure Shell", description: "most common use is command line access, secure replacement of Telnet. Could also be used as an encrypted tunnel for secure communication of virtually any service" },
		25: { name: "unsecure SMTP", fullname: "Simple Mail Transfer Protocol", description: "(unencrypted) for sending out E-Mails", tags: ["insecure"], alternatives: ["465/tcp", "587/tcp"] },
		110: { name: "unsecure POP3", fullname: "Post Office Protocol", description: "(unencrypted) for receiving E-Mails", tags: ["insecure"], alternatives: ["995/tcp"] },
		143: { name: "unsecure IMAP", fullname: "Internet Message Access Protocol", description: "(unencrypted) for receiving E-Mails", tags: ["insecure"], alternatives: ["993/tcp"] },
		161: { name: "SNMP", fullname: "Simple Network Management Protocol", description: "used for monitoring and managing network devices" },
		401: { name: "UPS", fullname: "Uninterruptible Power Supply", description: "used for monitoring and managing UPS devices" },
		443: { name: "HTTPS", fullname: "Hyper Text Transfer Protocol Secure", description: "encrypted web traffic" },
		445: { name: "SMB", fullname: "Server Message Block", description: "used for file sharing in Windows networks" },
		465: { name: "secure SMTP", fullname: "Simple Mail Transfer Protocol", description: "(encrypted) for sending out E-Mails" },
		500: { name: "IPsec", fullname: "Internet Protocol Security", description: "used for secure communication between devices" },
		515: { name: "LPD", fullname: "Line Printer Daemon", description: "used for printing over a network" },
		546: { name: "DHCPv6", fullname: "Dynamic Host Configuration Protocol for IPv6", description: "assigns IP addresses to devices in a network" },
		547: { name: "DHCPv6", fullname: "Dynamic Host Configuration Protocol for IPv6", description: "assigns IP addresses to devices in a network" },
		554: { name: "RTSP", fullname: "Real Time Streaming Protocol", description: "used for streaming audio and video" },
		587: { name: "secure SMTP", fullname: "Simple Mail Transfer Protocol", description: "(encrypted) for sending out E-Mails" },
		631: { name: "IPP", fullname: "Internet Printing Protocol", description: "used for printing over a network" },
		853: { name: "DNS over TLS", fullname: "DNS over TLS", description: "encrypted DNS traffic" },
		860: { name: "iSCSI", fullname: "Internet Small Computer System Interface", description: "used for storage area networks" },
		873: { name: "rsync", fullname: "rsync", description: "used for file synchronization" },
		993: { name: "secure IMAP", fullname: "Internet Message Access Protocol", description: "(encrypted) for receiving E-Mails" },
		995: { name: "secure POP3", fullname: "Post Office Protocol", description: "(encrypted) for receiving E-Mails" },
		1194: { name: "OpenVPN", fullname: "OpenVPN", description: "used for secure communication between devices" },
	},
	udp: {
		53: { name: "DNS", fullname: "Domain Name System", description: "resolves domain names to IP addresses", important: true },
		67: { name: "DHCP", fullname: "Dynamic Host Configuration Protocol", description: "assigns IP addresses to devices in a network", important: true },
		161: { name: "SNMP", fullname: "Simple Network Management Protocol", description: "used for monitoring and managing network devices" },
		401: { name: "UPS", fullname: "Uninterruptible Power Supply", description: "used for monitoring and managing UPS devices" },
		546: { name: "DHCPv6", fullname: "Dynamic Host Configuration Protocol for IPv6", description: "assigns IP addresses to devices in a network" },
		547: { name: "DHCPv6", fullname: "Dynamic Host Configuration Protocol for IPv6", description: "assigns IP addresses to devices in a network" },
		554: { name: "RTSP", fullname: "Real Time Streaming Protocol", description: "used for streaming audio and video" },
		993: { name: "secure IMAP", fullname: "Internet Message Access Protocol Secure", description: "(encrypted) for receiving E-Mails" },
		1194: { name: "OpenVPN", fullname: "OpenVPN", description: "used for secure communication between devices" },
	},
	icmp: {
		"echo-request": { name: "Ping", fullname: "Echo Request", description: "used to test if a host is reachable" },
	}
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