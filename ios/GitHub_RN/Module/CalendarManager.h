//
//  CalendarManager.h
//  GitHub_RN
//
//  Created by 意一ineyee on 2019/8/13.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
// 导入RCTBridgeModule头文件
#import <React/RCTBridgeModule.h>
// 导入RCTEventEmitter头文件
#import <React/RCTEventEmitter.h>

// 遵循RCTBridgeModule协议
@interface CalendarManager : RCTEventEmitter <RCTBridgeModule>

@end
