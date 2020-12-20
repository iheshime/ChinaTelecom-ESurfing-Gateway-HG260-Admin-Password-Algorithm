"use strict";

/*
 * ChinaTelecom ESurfing Gateway HG260 Admin Password Algorithm Demo Code
 * Reference: https://github.com/iheshime/ChinaTelecom-ESurfing-Gateway-HG260-Admin-Password-Algorithm
 */

;
(function () {
    const http = require("http");
    const onuIPAddress = "192.168.1.1"; // SET YOUR ONU IP ADDRESS HERE
    const decode = (digit) => {
        let tempCode = Number.parseInt(digit);

        if (Number.isNaN(tempCode))
            return "";

        if (tempCode >= 48 && tempCode <= 57)
            return String.fromCodePoint(tempCode);
        else if ([65, 66, 67, 68, 97, 98, 99, 100].includes(tempCode))
            tempCode -= (4 - 26);
        else
            tempCode -= 4;

        return String.fromCodePoint(tempCode);
    };

    http.get("http://" + onuIPAddress + ":8080/cgi-bin/baseinfoSet.cgi", (res) => {
        const { statusCode } = res;
        if (statusCode !== 200) {
            console.log("Can't access your ONU. Please try it manually.");
            res.resume();
            return;
        }

        res.setEncoding("utf-8");
        let rawData = "";
        res.on("data", (chunk) => { rawData += chunk; });
        res.on("end", () => {
            try {
                const dataObject = JSON.parse(rawData);
                const rawPassword = dataObject.BASEINFOSET.baseinfoSet_TELECOMPASSWORD;
                const regCheck = /[\d\d\&]+/;

                if (!regCheck.test(rawPassword)) {
                    console.log("Telecom admin password format is invalid. Please try it manually.");
                }

                const decodedPassword = rawPassword.split("&").map(x => (decode(x))).join("");
                console.log(`Decoded Telecom Admin Password is: ${decodedPassword}`);
            }
            catch (error) {
                console.error(error);
            }
        });
    });
})();