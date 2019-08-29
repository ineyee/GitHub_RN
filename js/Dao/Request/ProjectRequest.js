export default class ProjectRequest {
	static get(url) {
		return new Promise((resolve, reject) => {
			fetch(url)
				.then(response => {
					if (response.ok) {
						// 请求到的response其实是一个Response对象，它是一个很原始的数据格式，我们不能直接使用，先获取它的JSON字符串文本格式
						return response.text();
					} else {
						throw new Error('网络请求失败！');
					}
				})
				.then(responseText => {

					// 然后把JSON字符串序列化为JS对象
					const responseJSObj = JSON.parse(responseText);

					// 把请求成功的数据传递出去
					resolve(responseJSObj);
				})
				.catch((error) => {
					// 把请求失败的信息传递出去
					reject(error);
				})
		})
	}

	static post(url, params) {
		return new Promise((resolve, reject) => {
			fetch(url, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(params)
			})
				.then(response => {
					if (response.ok) {
						// 请求到的response其实是一个Response对象，它是一个很原始的数据格式，我们不能直接使用，先获取它的JSON字符串文本格式
						return response.text();
					} else {
						throw new Error('网络请求失败！');
					}
				})
				.then(responseText => {

					// 然后把JSON字符串序列化为JS对象
					const responseJSObj = JSON.parse(responseText);

					// 把请求成功的数据传递出去
					resolve(responseJSObj);
				})
				.catch((error) => {
					// 把请求失败的信息传递出去
					reject(error);
				})
		})
	}
}