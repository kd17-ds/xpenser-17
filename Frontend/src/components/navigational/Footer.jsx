import React from "react";
import {
    FaWhatsapp,
    FaInstagram,
    FaLinkedin,
    FaXTwitter,
    FaGithub,
} from "react-icons/fa6";
import { FiMail } from "react-icons/fi";

export default function Footer() {
    return (
        <footer className="bg-primary border-t border-secondary mt-12 sm:mx-15 px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 items-center text-txt text-center md:text-left py-2">
                {/* Left Section (Logo) */}
                <div>
                    <img
                        src="/assets/ds.png"
                        alt="D.S Logo"
                        className="h-[50px] sm:h-[65px]"
                    />
                </div>

                {/* Center Section (Text) */}
                <div>
                    <p className="font-semibold text-sm mb-1 text-center">
                        &copy; Xpenser - {new Date().getFullYear()}
                    </p>
                    <p className="text-xs text-center text-gray-500">All rights reserved.</p>
                </div>

                {/* Right Section (Social Icons) */}
                <div className="flex justify-center md:justify-end gap-5 text-xl sm:text-2xl">
                    <a
                        href="https://wa.me/916367248171"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-secondary transition-colors"
                    >
                        <FaWhatsapp />
                    </a>
                    <a
                        href="https://www.instagram.com/kd17_02/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-secondary transition-colors"
                    >
                        <FaInstagram />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/divyansh-sharma-1a7a24276/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-secondary transition-colors"
                    >
                        <FaLinkedin />
                    </a>
                    <a
                        href="https://twitter.com/I_am_DS_17"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-secondary transition-colors"
                    >
                        <FaXTwitter />
                    </a>
                    <a
                        href="mailto:shan17div@gmail.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-secondary transition-colors"
                    >
                        <FiMail />
                    </a>
                    <a
                        href="https://github.com/kd17-ds"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-secondary transition-colors"
                    >
                        <FaGithub />
                    </a>
                </div>
            </div>
        </footer>

    );
}
