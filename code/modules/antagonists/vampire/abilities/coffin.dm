
/obj/storage/closet/coffin/vampire
	name = "vampiric coffin"
	desc = "A vampire's place of rest. They can regenerate while inside."
	icon_state = "vampcoffin"
	icon_closed = "vampcoffin"
	icon_opened = "vampcoffin-open"
	_max_health = 50
	_health = 50

	open(entangleLogic, mob/user)
		if (!isvampire(user))
			return
		. = ..()

	attack_hand(mob/user)
		if (!isvampire(user))
			if (user.a_intent == INTENT_HELP)
				user.show_text("It won't budge!", "red")
			else
				user.show_text("It's built tough! A weapon would be more effective.", "red")
			return

		..()

	MouseDrop_T(atom/movable/O as mob|obj, mob/user as mob)
		if (!isvampire(user))
			user.show_text("It won't budge!", "red")
		else
			..()

	attackby(obj/item/I, mob/user)
		user.lastattacked = src
		_health -= I.force
		attack_particle(user,src)
		playsound(src.loc, 'sound/impact_sounds/Wood_Hit_1.ogg', 50, 1, pitch = 1.1)

		if (_health <= 0)
			logTheThing(LOG_COMBAT, user, "destroyed [src] at [log_loc(src)]")
			bust_out()


/datum/targetable/vampire/mark_coffin
	name = "Hide Coffin"
	desc = "Pick an area for your coffin to be hidden. The coffin is intangible until you use the Coffin Escape ability."
	icon_state = "coffin"
	targeted = TRUE
	target_anything = TRUE
	target_nodamage_check = TRUE
	check_range = FALSE
	cooldown = 60 SECONDS
	incapacitation_restriction = ABILITY_CAN_USE_WHEN_STUNNED
	can_cast_while_cuffed = TRUE
	sticky = TRUE
	unlock_message = "You have gained Hide Coffin. It allows you to hide a coffin somewhere on the station."



	cast(turf/target)
		. = ..()
		target = get_turf(target)

		if (!target)
			return TRUE

		var/mob/living/user = holder.owner
		var/datum/abilityHolder/vampire/AH = holder

		AH.coffin_turf = target
		boutput(user, "<span class='notice'>You plant your coffin on [target].</span>")

		logTheThing(LOG_COMBAT, user, "marks coffin on tile on [constructTarget(target,"combat")] at [log_loc(user)].")

	castcheck(atom/target)
		. = ..()
		if (istype(target, /turf/space) || isrestrictedz(target.z))
			boutput(src.holder.owner, "<span class='alert'>You cannot place your coffin there.</span>")
			return FALSE

/datum/targetable/vampire/coffin_escape
	name = "Coffin Escape"
	desc = "Become temporarily intangible and escape to a coffin where you can regenerate. If you have previously used Hide Coffin, the coffin will appear in that location."
	icon_state = "mist"
	check_range = FALSE
	cooldown = 60 SECONDS
	pointCost = 400
	incapacitation_restriction = ABILITY_CAN_USE_ALWAYS
	can_cast_while_cuffed = FALSE
	sticky = TRUE
	unlock_message = "You have gained Coffin Escape. It allows you to heal within a coffin."

	cast(mob/target)
		. = ..()
		var/mob/living/user = holder.owner
		var/datum/abilityHolder/vampire/AH = holder

		var/obj/storage/closet/coffin/vampire/coffin = new(AH.coffin_turf)
		animate_buff_in(coffin)

		AH.the_coffin = coffin

		var/obj/projectile/proj = initialize_projectile_pixel_spread(M, new/datum/projectile/special/homing/travel, spawnturf)
		var/tries = 5
		while (tries > 0 && (!proj || proj.disposed))
			proj = initialize_projectile_pixel_spread(M, new/datum/projectile/special/homing/travel, spawnturf)

		proj.special_data["owner"] = user
		proj.targets = list(coffin)

		proj.launch()

		logTheThing(LOG_COMBAT, user, "begins escaping to a coffin from [log_loc(user)] to [log_loc(AH.coffin_turf)].")

		if (get_turf(coffin) == get_turf(user))
			user.set_loc(coffin)

	castcheck(atom/target)
		. = ..()
		var/mob/user = src.holder.owner
		var/datum/abilityHolder/vampire/AH = src.holder

		if (!AH.coffin_turf)
			AH.coffin_turf = get_turf(user)

		var/turf/spawnturf = AH.coffin_turf
		var/turf/owner_turf = get_turf(user)
		if (spawnturf.z != owner_turf?.z)
			boutput(user, "<span class='alert'>You cannot escape to a different Z-level.</span>")
			return TRUE
