execute as @a[tag=!startedbladeV5] run function startedblade

execute as @a run function blade_functions

execute as @a[scores={blade=1..}] run function bladelevel 

tag @a[scores={printlevel=1..}] add printlevel

execute as @a[tag=printlevel] run function level
#sneaking

tag @a[scores={combocool=1..}] add combocool

execute as @a[tag=combocool] run function combocool

execute as @a[scores={bladecool=4}] run playsound block.lantern.break @s ^^^0.5 5 1.8 1 

scoreboard players remove @a[scores={sa=1..}] sa 1
scoreboard players remove @a[scores={meleeup=1..}] meleeup 1
scoreboard players remove @a[scores={bladecool=1..}] bladecool 1

execute as @a[scores={around=1..}] run function fly
execute as @a[scores={antipro=1..}] run function antipro
execute as @a[scores={antidmg=1..}] run function antidmg

execute as @e[tag=end_projectile] run scriptevent zex:end_projectile


gamerule commandblockoutput false

scoreboard players remove @e[scores={bladesword=0..}] bladesword 1
