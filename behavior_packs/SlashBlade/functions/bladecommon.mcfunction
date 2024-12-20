
execute if entity @e[family=monster,r=3,c=1] run tag @p add sedr
execute as @s[tag=!sedr] if entity @e[family=monster,rm=3,r=6,c=1] run tag @p add sed
scoreboard players remove @s[tag=sed,scores={blade=1..}] blade 3
scoreboard players add @s[tag=sedr,scores={blade=..70}] blade 2
execute at @s[tag=!cool,scores={blade=..199}] run damage @e[r=5,family=monster] 2 override entity @s[tag=!cool]
execute at @s[tag=!cool,scores={blade=200..399}] run damage @e[r=5,family=monster] 4 override entity @s[tag=!cool]
execute at @s[tag=!cool,scores={blade=400..599}] run damage @e[r=5,family=monster] 5 override entity @s[tag=!cool]
execute at @s[tag=!cool,scores={blade=600..}] run damage @e[r=5,family=monster] 7 override entity @s[tag=!cool]
tag @s remove sed
tag @s remove sedr
playsound swingblade.c @s
playanimation @s[scores={wood=0}] animation.sword.first.using
playanimation @s[scores={wood=1}] animation.sword.first.using2
playanimation @s[scores={wood=2}] animation.sword.first.using
playanimation @s[scores={wood=3}] animation.sword.first.using
playanimation @s[scores={wood=4}] animation.sword.first.using2
scoreboard players add @s[scores={wood=..5}] wood 1
scoreboard players set @s[scores={wood=5..}] wood 0
function level