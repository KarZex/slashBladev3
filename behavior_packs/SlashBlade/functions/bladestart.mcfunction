execute as @a[tag=!startedbladeV4] run function startedblade

execute as @a run function blade_functions
function cooldown

execute as @a[scores={blade=1..}] run function bladelevel 

tag @a[scores={printlevel=1..}] add printlevel

execute as @a[tag=printlevel] run function level

tag @a[scores={combocool=1..}] add combocool

execute as @a[tag=combocool] run function combocool

scoreboard players remove @a[scores={sa=1..}] sa 1
scoreboard players remove @a[scores={meleeup=1..}] meleeup 1
scoreboard players remove @a[scores={bladecool=1..}] bladecool 1

execute as @a[scores={around=1..}] run function fly
execute as @a[scores={antipro=1..}] run function antipro
execute as @a[scores={antidmg=1..}] run function antidmg


gamerule commandblockoutput false

