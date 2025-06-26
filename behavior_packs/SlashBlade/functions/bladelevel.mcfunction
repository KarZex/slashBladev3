scoreboard players remove @s[scores={bladec=1..}] bladec 1
execute if entity @s[scores={bladec=0}] unless score @s blade matches 32 unless score @s blade matches 64 unless score @s blade matches 96 unless score @s blade matches 128 run scoreboard players remove @s blade 1
scoreboard players set @s[scores={bladec=0}] bladec 3
