scoreboard objectives add run dummy
scoreboard players set @s[tag=!run1] run 0
effect @s[tag=!run1] speed 1 10
tag @s[scores={run=..5}] add run1
scoreboard players add @s[scores={run=..5}] run 1
effect @s[scores={run=5..}] speed 0 10
tag @s[scores={run=5..}] remove run1
tag @s[scores={run=5..}] remove run