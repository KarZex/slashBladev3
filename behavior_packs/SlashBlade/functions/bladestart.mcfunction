execute as @a[tag=!startedblade] run function startedblade


function cooldown

execute as @a[scores={blade=1..9}] run function bladelevel 
execute as @a[scores={blade=11..19}] run function bladelevel 
execute as @a[scores={blade=21..29}] run function bladelevel 
execute as @a[scores={blade=31..39}] run function bladelevel 
execute as @a[scores={blade=41..}] run function bladelevel 

execute as @a[scores={printlevel=1..}] run function level

scoreboard players remove @a[scores={sa=1..}] sa 1
scoreboard players remove @a[scores={meleeup=1..}] meleeup 1

gamerule commandblockoutput false

