from schema import Schema
import re
import json
import os
import requests

class GenSchema:
    def __init__(self, schema: Schema):
        self.schema = schema
        self.params = {}
        self.gentitle = ""
        self.genbody = ""
    def __replace_placeholders(self,text: str, params: dict):
        pattern = r"\{(.*?)\}"
        return re.sub(pattern, lambda match: params.get(match.group(1), match.group(0)), text)

    def __validate_params(self, params: dict):
        missing_params = [param for param in self.schema.params if param not in params]
        if missing_params:
            raise ValueError(f"Missing parameters: {', '.join(missing_params)}")

    def generate(self, params: dict):
        self.__validate_params(params)
        self.gentitle = self.__replace_placeholders(str(self.schema.title), params)
        self.genbody = self.__replace_placeholders(str(self.schema.body), params)


class ExponentPushToken(str):
    def __init__(self, token: str):
        self.__validateExpoToken(token)
        str.__new__(ExponentPushToken, token)

    def __validateExpoToken(self,token :str):
        if not token.startswith("ExponentPushToken["):
            raise ValueError("Invalid Expo token")
        if not token.endswith("]"):
            raise ValueError("Invalid Expo token")

    def __str__(self):
        return super().__str__()
    
    def __repr__(self):
        return super().__repr__()


def dispatchGenSchema(gschema: GenSchema , targets : list ,  scheduled_at : int):
    try:

        url = f"http://localhost:{os.environ["DISPATCHER_PORT"]}/campaign"
        #print(url , os.environ)
        payload = json.dumps({
        "scheduled_at": scheduled_at,
        "to": targets,
        "message": {
            "title": gschema.gentitle,
            "body": gschema.genbody
        }
        })
        headers = {
        'Authorization':  os.environ["DISPATCHER_AUTH_SECRET"],
        'Content-Type': 'application/json'
        }

        response = requests.request("POST", url, headers=headers, data=payload)
        return (response.json(), response.status_code)
    except:
        raise ValueError("Invalid parameters")
