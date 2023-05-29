namespace api;

//public class BaseResponse<T>
//{
//	public bool Success { get; set; }
//	public string Message { get; set; }
//	public T Body { get; set; }
//}

abstract public class BaseResponseBase
{
	public bool Success { get; set; } = true;
	public string Message { get; set; } = "";
}

public class BaseResponseEmpty: BaseResponseBase
{
	public object Body { get; set; } = new { };
}

public class BaseResponse<T> : BaseResponseBase
{
	public T Body { get; set; }
}