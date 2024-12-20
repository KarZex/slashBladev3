scoreboard objectives add fly dummy
scoreboard players set @s[tag=!fly1] fly 0
effect @s[tag=!fly1] slow_falling 1 6
tag @s[scores={fly=..5}] add fly1
scoreboard players add @s[scores={fly=..5}] fly 1
effect @s[scores={fly=5..}] levitation 0 10
effect @s[scores={fly=5..}] slow_falling 0 6
tag @s[scores={fly=5..}] remove fly1
tag @s[scores={fly=5..}] remove fly