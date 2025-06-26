execute if entity @s[scores={printlevel=1..}] run scriptevent zex:printlevel
scoreboard players remove @s[scores={printlevel=-3..}] printlevel 1
title @s[scores={printlevel=..0}] actionbar §rair
tag @s[scores={printlevel=-3}] remove printlevel