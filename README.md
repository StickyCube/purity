General options
{
	required: 	Boolean
	default: 	Any | Function,
	mutator: 	Function,
	cast: 		Boolean
}

Array options
{
	purge: 		Boolean,
	unique: 	Boolean,
	sort: 		String('asc|desc')|Function
}

String options
{
	tolower: 	Boolean,
	toupper: 	Boolean,

	regex: 		RegExp
	minlength: 	Positive Integer,
	maxlength: 	Positive Integer,
	fixedwidth: Positive Integer
}

Number options
{
	integer: 	Boolean,
	tofixed: 	Number 0 - 20, (#round up/down)
	mod: 		Positive Integer
	abs: 		Boolean,
	neg: 		Boolean,

	gt:			Number,
	gte:		Number,
	lt:			Number,
	lte:		Number
}