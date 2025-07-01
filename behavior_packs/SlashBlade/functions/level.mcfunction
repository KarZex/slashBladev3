execute if entity @s[scores={printlevel=1..}] run scriptevent zex:printlevel
scoreboard players remove @s[scores={printlevel=-3..}] printlevel 1
title @s[scores={printlevel=..0}] actionbar §rzex.blade
tag @s[scores={printlevel=-3}] remove printlevel