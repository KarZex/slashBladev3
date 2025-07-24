scoreboard objectives add blade dummy
scoreboard objectives add bladec dummy
scoreboard objectives add printlevel dummy
scoreboard objectives add around dummy

scoreboard objectives add wood dummy

scoreboard objectives add wooda dummy
scoreboard objectives add whitea dummy
scoreboard objectives add slashbladea dummy
scoreboard objectives add tukumoa dummy
scoreboard objectives add muramasaa dummy

scoreboard objectives add rep dummy

scoreboard objectives add cool dummy

scoreboard objectives add coolw dummy

scoreboard objectives add sa dummy
scoreboard objectives add meleeup dummy

scoreboard objectives add combotype dummy
scoreboard objectives add combocool dummy

execute as @a[tag=!startedblade] run scoreboard players set @s cooldown 20
execute as @a[tag=!startedblade] run scoreboard players set @s blade 0
execute as @a[tag=!startedblade] run scoreboard players set @s around 0
execute as @a[tag=!startedblade] run scoreboard players set @s bladec 10
execute as @a[tag=!startedblade] run scoreboard players set @s printlevel 0
execute as @a[tag=!startedblade] run scoreboard players set @s sa 0
execute as @a[tag=!startedblade] run scoreboard players set @s meleeup 0
execute as @a[tag=!startedblade] run scoreboard players set @s cool 0
execute as @a[tag=!startedblade] run scoreboard players set @s coolw 0
execute as @a[tag=!startedblade] run scoreboard players set @s wood 0
execute as @a[tag=!startedblade] run scoreboard players set @s rep 0
tag @a[tag=!startedblade] add startedblade 