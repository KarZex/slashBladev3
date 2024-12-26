execute as @a[tag=!startedblade] run function startedblade


function cooldown

execute as @a[scores={blade=1..}] run function bladelevel 

execute as @a[scores={printlevel=1..}] run function level

scoreboard players remove @a[scores={sa=1..}] sa 1
scoreboard players remove @a[scores={meleeup=1..}] meleeup 1

execute as @a[scores={around=1..}] run function fly
execute as @a[scores={antipro=1..}] run function antipro
execute as @a[scores={antidmg=1..}] run function antidmg

gamerule commandblockoutput false

