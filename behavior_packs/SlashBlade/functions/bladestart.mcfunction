execute as @a[tag=!startedblade] run function startedblade


function cooldown

function sounds

execute as @a[tag=!nfeature] run function feature

scoreboard players remove @a[scores={sa=1..}] sa 1
scoreboard players remove @a[scores={meleeup=1..}] meleeup 1

execute as @a[tag=fly] run function fly
execute as @a[tag=run] run function run


gamerule commandblockoutput false

