/****************************************
 * 
 *   User Management: Plugin for AstralMod that gives information about users
 *   Copyright (C) 2017 Victor Tran
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 * 
 * *************************************/

var client;
var consts;

//Variables for the deal command
/*var actionMember = {};
var actioningMember = {};
var actionStage = {};
var actionToPerform = {};*/
var actions = {};

function pollBans() {
    var date = new Date().getTime();
    for (key in settings.guilds) {
        let guildSetting = settings.guilds[key];
        if (guildSetting != null) {
            if (guildSetting.tempbans != null) {
                for (index in guildSetting.tempbans) {
                    let tempban = guildSetting.tempbans[index];
                    if (tempban.timeout < date) {
                        //Unban user
                        client.guilds.get(key).unban(tempban.user, "Temporary Ban lifted");

                        //Notify server staff
                        client.channels.get(guildSetting.botWarnings).send(":asterisk: <@" + tempban.user + ">'s temporary ban has been lifted.");

                        settings.guilds[key].tempbans.splice(index, 1);
                    }
                }
            }
        }
    }
}


function processDeal(message) {
    //Handle the deal command

    var msg = message.content;
    var member = actions[message.guild.id].actionMember;
    if (actions[message.guild.id].actionStage == 0) { //Select Action
        if (msg.toLowerCase() == "cancel") { //Cancel Action
            message.channel.send(':gear: Cancelled. Exiting action menu.');
            member = null;
            actions[message.guild.id] = null;
            releaseInput(message.guild.id);
        } else if ((msg.toLowerCase() == "interrogate" || msg.toLowerCase() == "i") && (message.guild.id == consts.aphc.id || message.guild.id == 287937616685301762 || message.guild.id == 305039436490735627)) {
            if (message.guild.id == consts.aphc.id) {
                member.addRole(member.guild.roles.get(consts.aphc.interrogationRole));
            } else if (message.guild.id == 287937616685301762) {
                member.addRole(member.guild.roles.get("319847521440497666"));
            } else if (message.guild.id == 305039436490735627) {
                member.addRole(member.guild.roles.get("326250571692769281"));
            }
            member.setVoiceChannel(member.guild.channels.get(member.guild.afkChannelID));
            message.channel.send(':gear: ' + getUserString(member) + " has been placed in interrogation.");
            member = null;
            actions[message.guild.id] = null;
            releaseInput(message.guild.id);
        } else if ((msg.toLowerCase() == "jail" || msg.toLowerCase() == "j") && (message.guild.id == consts.aphc.id || message.guild.id == 263368501928919040 || message.guild.id == 305039436490735627)) {
            if (message.guild.id == consts.aphc.id) {
                member.addRole(member.guild.roles.get(consts.aphc.jailRole));
            } else if (message.guild.id == 305039436490735627) {
                member.addRole(member.guild.roles.get("310196007919157250"));
            } else {
                member.addRole(member.guild.roles.get("267731524734943233"));
            }
            member.setVoiceChannel(member.guild.channels.get(member.guild.afkChannelID));
            message.channel.send(':gear: ' + getUserString(member) + " has been placed in jail.");
            member = null;
            actions[message.guild.id] = null;
            releaseInput(message.guild.id);
        } else if ((msg.toLowerCase() == "mute" || msg.toLowerCase() == "m") && (message.guild.id == consts.aphc.id || message.guild.id == 305039436490735627)) {
            var roleId;
            if (message.guild.id == consts.aphc.id) {
                roleId = consts.aphc.jailRole;
            } else if (message.guild.id == 305039436490735627) {
                roleId = "309883481024888842";
            }
            
            if (member.roles.get(roleId)) {
                member.removeRole(member.roles.get(roleId));
                message.channel.send(':gear: ' + getUserString(member) + " has been removed from time out.");
                member = null;
                actions[message.guild.id] = null;
                releaseInput(message.guild.id);
            } else {
                member.addRole(member.guild.roles.get(roleId));
                message.channel.send(':gear: ' + getUserString(member) + " has been placed on time out.");
                member = null;
                actions[message.guild.id] = null;
                releaseInput(message.guild.id);
            }
        } else if (msg.toLowerCase() == "kick" || msg.toLowerCase() == "k") {
            actions[message.guild.id].actionStage = 1;
            message.channel.send(":gear: Enter reason for kicking " + getUserString(member) + " or `cancel`.");
            actions[message.guild.id].actionToPerform = "kick";
        } else if (msg.toLowerCase() == "ban" || msg.toLowerCase() == "b") {
            actions[message.guild.id].actionStage = 1;
            message.channel.send(":gear: Enter reason for banning " + getUserString(member) + " or `cancel`.");
            actions[message.guild.id].actionToPerform = "ban";
        } else if (msg.toLowerCase() == "nick" || msg.toLowerCase == "nickname" || msg.toLowerCase() == "n") {
<<<<<<< HEAD
            actions[message.guild.id].actionStage = 1;
            message.channel.send(":gear: Enter new nickname for " + getUserString(member) + ". Alternatively type `clear` or `cancel`.");
            actions[message.guild.id].actionToPerform = "nick";
        } else if (msg.toLowerCase() == "tempban" || msg.toLowerCase() == "t") {
            actions[message.guild.id].actionStage = 1;
            message.channel.send(":gear: Enter time to ban " + getUserString(member) + " for, or `cancel`.");
            actions[message.guild.id].actionToPerform = "tempban";
=======
            actionStage[message.guild.id] = 1;
            message.channel.send(":gear: Enter new nickname for " + getUserString(member) + ". Alternatively, type `clear` or `cancel`.");
            actionToPerform[message.guild.id] = "nick";
>>>>>>> 40686a9550d29edd6986f7a9618e0430dd023ab2
        } else {
            message.channel.send(':gear: Unknown command. Exiting action menu.');
            member = null;
            actions[message.guild.id] = null;
            releaseInput(message.guild.id);
        }
        message.delete().catch(function() {
                logPromiseRejection(message, "messageDelete");
        });
    } else if (actions[message.guild.id].actionStage == 1) {
        if (msg.toLowerCase() == "cancel") {
            message.channel.send(':gear: Cancelled. Exiting action menu.');
            member = null;
            actions[message.guild.id] = null;
            releaseInput(message.guild.id);
        } else if (actions[message.guild.id].actionToPerform == "kick") {
            member.kick(msg).then(function(member) {
                message.channel.send(':gear: ' + getUserString(member) + " has been kicked from the server.");
                member = null;
                actions[message.guild.id] = null;
                releaseInput(message.guild.id);
            }).catch(function() {
                message.channel.send(':gear: ' + getUserString(member) + " couldn't be kicked from the server. Exiting action menu");
                member = null;
                actions[message.guild.id] = null;
                releaseInput(message.guild.id);
            });
        } else if (actions[message.guild.id].actionToPerform == "ban") {
            member.ban(msg).then(function(member) {
                message.channel.send(':gear: ' + getUserString(member) + " has been banned from the server.");
                member = null;
                actions[message.guild.id] = null;
                releaseInput(message.guild.id);
            }).catch(function() {
                message.channel.send(':gear: ' + getUserString(member) + " couldn't be banned from the server. Exiting action menu.");
                member = null;
                actions[message.guild.id] = null;
                releaseInput(message.guild.id);
            });
        } else if (actions[message.guild.id].actionToPerform == "tempban") {
            let timeToParse = msg.toLowerCase();
            let time = parseTime(timeToParse);
            if (isNaN(time)) {
                message.channel.send(":gear: You'll need to supply a time for this user to be banned for. For example, `5d` for five days, or `30m` for 30 minutes. Alternatively, type `cancel` to cancel the temporary ban.");                
            } else {
                let endDate = new Date().getTime() + time * 1000;
                actions[message.guild.id].time = endDate;
                actions[message.guild.id].actionStage = 2;
                message.channel.send(":gear: Enter reason for temporarily banning " + getUserString(member) + " for " + parseInt(time) + " seconds until " + new Date(endDate).toUTCString() + ", or `cancel`.");
            }
        } else if (actions[message.guild.id].actionToPerform == "nick") {
            if (msg.toLowerCase() == "clear") {
                msg = "";
            }
            
            member.setNickname(msg).then(function(member) {
                message.channel.send(':gear: ' + getUserString(member) + " has changed their nickname.");
                member = null;
                actions[message.guild.id] = null;
                releaseInput(message.guild.id);
            }).catch(function() {
                message.channel.send(':gear: ' + getUserString(member) + " couldn't have their nickname changed. Exiting action menu.");
                member = null;
                actions[message.guild.id] = null;
                releaseInput(message.guild.id);
            });
        }
        message.delete().catch(function() {
            logPromiseRejection(message, "messageDelete");
        });
    } else if (actions[message.guild.id].actionStage == 2) {
        if (msg.toLowerCase() == "cancel") {
            message.channel.send(':gear: Cancelled. Exiting action menu.');
            member = null;
            actions[message.guild.id] = null;
            releaseInput(message.guild.id);
        } else if (actions[message.guild.id].actionToPerform == "tempban") {
            member.ban(msg).then(function(member) {
                let banObject = {
                    timeout: actions[message.guild.id].time,
                    user: member.user.id
                };

                if (settings.guilds[message.guild.id].tempbans == null) {
                    settings.guilds[message.guild.id].tempbans = [];
                }
    
                settings.guilds[message.guild.id].tempbans.push(banObject);

                message.channel.send(':gear: ' + getUserString(member) + " has been banned from the server. This ban will be lifted at " + new Date(actions[message.guild.id].time).toUTCString() + ".");
                member = null;
                actions[message.guild.id] = null;
                releaseInput(message.guild.id);
            }).catch(function() {
                message.channel.send(':gear: ' + getUserString(member) + " couldn't be banned from the server. Exiting action menu");
                member = null;
                actions[message.guild.id] = null;
                releaseInput(message.guild.id);
            });
        }
    }

    if (actions[message.guild.id] != null) {
        actions[message.guild.id].actionMember = member;
    }
}

function processCommand(message, isMod, command) {
    if (isMod) {
        if (command.startsWith("uinfo ")) {
            var user = command.substr(6);

            var index = 0;
            if (user.indexOf("--index") != -1) {
                //Extract index
                var indexArg = user.indexOf("--index");
                var number = user.indexOf(" ", indexArg);
                var numberEnd = user.indexOf(" ", number + 1);
                if (numberEnd == -1) {
                    numberEnd = user.length;
                }
                var ind = user.substring(number + 1, numberEnd);
                index = parseInt(ind);

                if (isNaN(index)) {
                    throw new UserInputError("Parameter index is not a number");
                }

                //Remove parameter from string
                if (numberEnd == user.length) {
                    user = user.substr(0, indexArg).trim();
                } else {
                    user = user.substr(0, indexArg) + user.substr(numberEnd + 1).trim();
                }
            }

            var users = parseUser(user, message.guild);
            if (users.length > 0) {
                uinfo(users[index], message.channel, message.guild);
            } else {
                throw new CommandError("No user found with that name");
            }

            return true;
        }
    }

    if (command == "uinfo") {
        uinfo(message.author, message.channel, message.member.guild);
        return true;
    } else if (command.startsWith("uinfo ")) {
        var user = command.substr(6);

        var index = 0;
        if (user.indexOf("--index") != -1) {
            //Extract index
            var indexArg = user.indexOf("--index");
            var number = user.indexOf(" ", indexArg);
            var numberEnd = user.indexOf(" ", number + 1);
            if (numberEnd == -1) {
                numberEnd = user.length;
            }
            var ind = user.substring(number + 1, numberEnd);
            index = parseInt(ind);

            if (isNaN(index)) {
                throw new UserInputError("Parameter index is not a number");
            }

            //Remove parameter from string
            if (numberEnd == user.length) {
                user = user.substr(0, indexArg).trim();
            } else {
                user = user.substr(0, indexArg) + user.substr(numberEnd + 1).trim();
            }
        }

        var users = parseUser(user, message.guild);
        if (users.length > 0) {
            uinfo(users[index], message.channel);
        } else {
            throw new CommandError("No user found with that name");
        }

        return true;
    } else if (command == "find") {
        message.reply("Usage: `" + prefix + "find user`. For more information, `" + prefix + "help find`");
    } else if (command.startsWith("find ")) {
        var query = command.substr(5);

        if (query == "my phone") {
            message.channel.send(getRandom("In your pocket",
                                           "On your table",
                                           "Run over by a car",
                                           "Accidentally fell off the table"));
            return;
        } else if (query == "my iphone") {
            message.channel.send("https://icloud.com/#find");
        } else if (query == "my android" || query == "my android phone") {
            message.channel.send("https://www.google.com/android/find");
            return;
        } else if (query == "my keys") {
            message.channel.send(getRandom("On a keyring",
                                           "In the keyhole on the door"));
            return;
        } else if (query == "victor something to do" || query == "me something to do" || query == "a cure for boredom") {
            message.channel.send(getRandom("Boating :sailboat:",
                                           "Skiing :skier:",
                                           "\"Codding\" :computer:",
                                           "Walking :walking:",
                                           "Singing :microphone:",
                                           "Eating Sushi :sushi:",
                                           "Insulting Tatsumaki :snake:",
                                           "Plucking flowers :sunflower:"));
            return;
        }

        var searchResults = parseUser(query, message.guild);

        if (searchResults.length == 0) {
            throw new CommandError("No users found");
        } else {
            var reply = "Here's who I found.```";

            var currentNumber = 0;
            for (user of searchResults) {
                reply += parseInt(currentNumber) + ": " + user.tag + ": " + user.id + (user.bot ? " [BOT]" : "") + "\n";
                if (currentNumber == 9) {
                    reply += "\n----- " + parseInt(searchResults.length - currentNumber) + " more. -----\n";
                    reply += "Please narrow your query.";
                    break;
                }
                currentNumber++;
            }
            reply += "```";
            message.channel.send(reply);
        }
        return true;
    } else if (command.startsWith("deal ") || command.startsWith("manage ")) {
        if (actions[message.guild.id] != null) {
            message.channel.send(':no_entry_sign: ERROR: ' + getUserString(actions[message.guild.id].actioningMember) + " is already managing another user.");
        } else {
            if (command.startsWith("deal")) {
                command = command.substr(5);
            } else if (command.startsWith("manage")) {
                command = command.substr(7);
            }
            var memberID = command.replace("<", "").replace(">", "").replace("@", "").replace("!", "");

            var users = parseUser(memberID, message.guild);
            if (users.length > 0) {
                var user = null;

                //Filter out members
                for (var i = 0; i < users.length; i++) {
                    if (message.guild.members.has(users[i].id)) {
                        user = users[i].id;
                        i = users.length;
                    }
                }

                if (user == null) {
                    throw new CommandError("No user found with that name on this server");
                } else {
                    var member = message.guild.member(user);
                    if (member == null) {
                        throw new CommandError("An internal error was encountered.");
                    } else {
                        if (member.highestRole.comparePositionTo(message.member.highestRole) >= 0) {
                            throw new CommandError("You're not allowed to manage this user.");
                        } else {
                            var canDoActions = false;
                            var msg = ':gear: ' + getUserString(member) + ": `cancel` ";
                            if (member.kickable) {
                                msg += '`(k)ick` ';
                                canDoActions = true;
                            }
                            
                            if (member.bannable) {
                                msg += '`(b)an` `(t)empban` ';
                                canDoActions = true;
                            }

                            if (!member.highestRole.comparePositionTo(message.guild.me.highestRole) >= 0 && message.guild.me.hasPermission("MANAGE_NICKNAMES")) {
                                msg += '`(n)ick` ';
                                canDoActions = true;
                            }
                            
                            if (message.guild.id == 287937616685301762 || message.guild.id == consts.aphc.id) {
                                msg += "`(i)nterrogate` ";
                                canDoActions = true;
                            }
                            
                            if (message.guild.id == consts.aphc.id || message.guild.id == 263368501928919040) {
                                msg += "`(j)ail` ";
                                canDoActions = true;
                            }
                            
                            if (message.guild.id == consts.aphc.id) {
                                msg += "`(m)ute` ";
                                canDoActions = true;
                            }
                            
                            if (canDoActions) {
                                actions[message.guild.id] = {};
                                actions[message.guild.id].actionMember = member;
                                actions[message.guild.id].actioningMember = message.author;
                                actions[message.guild.id].actionStage = 0;
                                message.channel.send(msg);
                                captureInput(processDeal, message.guild.id, message.author.id);
                            } else {
                                throw new CommandError("No actions can be perfomed on this user.");
                            }
                        }
                    }
                }
            } else {
                throw new CommandError("No user found with that name");
            }
        }
        message.delete().catch(function() {
            logPromiseRejection(message, "messageDelete");
        });
        return true;
    }
}

var pollBan;
module.exports = {
    name: "Users",
    constructor: function(discordClient, commandEmitter, constants) {
        client = discordClient;
        consts = constants;

        commandEmitter.on('processCommand', processCommand);
        
        pollBan = setInterval(pollBans, 1000)
    },
    destructor: function(commandEmitter) {
        commandEmitter.removeListener('processCommand', processCommand);

        clearInterval(pollBans);
    },
    availableCommands: {
        general: {
            commands: [
                "uinfo",
                "find"
            ],
            modCommands: [
                "deal"
            ]
        }
    },
    acquireHelp: function(helpCmd) {
        var help = {};

        switch (helpCmd) {
            case "uinfo":
                help.title = prefix + "uinfo";
                help.usageText = prefix + "uinfo user";
                help.helpText = "Acquire information about a user";
                help.options = [
                    "--index [num] Zero based index of user to query"
                ]
                help.param1 = "- The user of which to acquire information";
                break;
            case "find":
                help.title = prefix + "find";
                help.usageText = prefix + "find user";
                help.helpText = "Finds a user and returns their ID";
                help.param1 = "The user you want to find.";
                help.remarks = "AstralMod will search for users from all connected servers."
                break;
            case "deal":
                help.title = prefix + "deal";
                help.usageText = prefix + "deal user";
                help.helpText = "Manages a user";
                help.param1 = "- The user to manage";
                break;
        }

        return help;
    }
}
