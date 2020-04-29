module.exports = {
    keys: {
        token: "", // This is where the token for your bot account goes
        settingsKey: "", // This is the encryption key for the settings file. What you input here really doesn't matter - it should be about 32 characters (if you go any longer it will be truncated). Don't change it or else you won't be able to use your settings file again. 
        yandexKey: "" // This is the token used for the Yandex.Translate API. You can leave this blank, but 'am:tr' will be disabled. If you want to use 'am:tr' though, you can get a token at https://tech.yandex.com/translate/ and insert it here.
    },
    config: {
        prefix: "cj!", // This is the default prefix used by AstralMod.
        bprefix: "cj#", // This is the default prefix used by AstralMod when it is running as AstralMod Blueprint.
        pinToPinEmoji: "📌", // This is used as the emoji for the Portable Pins and the Pin to Pin feature. You can generally leave this as the default, but if you have other bots that interpret the 📌 emoji as something else, you might want to change it.
        calcProcess: "/usr/bin/thecalculator", // This is a path to the compiled binary for theCalculator, used for calculating expressions in 'am:calc'. You can leave this blank, but 'am:calc' will be disabled. You can grab a copy of theCalculator at https://github.com/vicr123/thecalculator/releases.
        emojiServer: "" // This is the server ID of a server that has all of the AstralMod-specific emoji. More information about setting up the emoji can be found below. You can leave this blank, but all custom emoji will be replaced by ➡.
    },
    colors: { // These are the colors used for embeds.
        done: "#FFC000",
        info: "#1E3C8C",
        fail: "#FF5000",
        none: "#36393F"
    }
}
