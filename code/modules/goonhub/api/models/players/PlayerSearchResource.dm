
/// PlayerSearchResource
/datum/apiModel/PlayerSearchResource
	var/id			= null 	// integer
	var/ip			= null 	// string
	var/comp_id		= null 	// string
	var/player_id	= null 	// integer
	var/ckey		= null 	// string
	var/created_at	= null 	// string

/datum/apiModel/PlayerSearchResource/New(
	id,
	ip,
	comp_id,
	player_id,
	ckey,
	created_at
)
	. = ..()
	src.id = id
	src.ip = ip
	src.comp_id = comp_id
	src.player_id = player_id
	src.ckey = ckey
	src.created_at = created_at

/datum/apiModel/PlayerSearchResource/VerifyIntegrity()
	if (
		isnull(id)
		|| isnull(ip)
		|| isnull(comp_id)
		|| isnull(player_id)
		|| isnull(ckey)
		|| isnull(created_at)
	)
		return FALSE

/datum/apiModel/PlayerSearchResource/ToString()
	. = list()
	.["id"] = src.id
	.["ip"] = src.ip
	.["comp_id"] = src.comp_id
	.["player_id"] = src.player_id
	.["ckey"] = src.ckey
	.["created_at"] = src.created_at
	return json_encode(.)
