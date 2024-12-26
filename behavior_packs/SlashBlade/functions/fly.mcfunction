scoreboard players remove @s[scores={around=1..}] around 1
tag @s add around
execute at @s run damage @e[r=2,tag=!around] 4 override entity @s
tag @s remove around
