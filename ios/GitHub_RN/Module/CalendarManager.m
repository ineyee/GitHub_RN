//
//  CalendarManager.m
//  GitHub_RN
//
//  Created by 意一ineyee on 2019/8/13.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "CalendarManager.h"
#import <React/RCTConvert.h>

@interface CalendarManager()

// 我们定义两个block，用来记录OC方法那两个block，因为我们不确定具体要在哪里调用这两个block
@property (nonatomic, copy) RCTPromiseResolveBlock resolve;
@property (nonatomic, copy) RCTPromiseRejectBlock reject;

@end


@implementation CalendarManager

#pragma mark - 成员变量

{
  // 原生模块是否有监听者，用来优化无监听情况下造成的w额外开销
  bool hasListeners;
}


#pragma mark - 导出

// 实现RCTBridgeModule协议
// 导出该原生模块
RCT_EXPORT_MODULE();

// 导出该原生模块的方法
RCT_EXPORT_METHOD(addEvent:(NSString *)name details:(NSDictionary *)details)
{
  NSString *location = [RCTConvert NSString:details[@"location"]];
  NSDate *date = [RCTConvert NSDate:details[@"date"]];

  NSLog(@"事件名：%@，地点：%@，日期：%@", name, location, date);
}

RCT_REMAP_METHOD(findEvents,
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  // 记录OC方法这两个block，以便在合适的地方调用
  self.resolve = resolve;
  self.reject = reject;
  
  // 假设我们这里是打开日历模块，读取事件
  [self _openCalendarAndFindEvents];
}


#pragma mark - 重写RCTEventEmitter的几个方法

// 所有支持的事件，和原生模块那边约定好的事件名
- (NSArray<NSString *> *)supportedEvents
{
  return @[@"EventReminder"];
}

// 原生模块添加第一个监听者时会触发该方法
- (void)startObserving
{
  hasListeners = YES;
}

// 原生模块的最后一个监听者移除时会触发该方法
- (void)stopObserving
{
  hasListeners = NO;
}


#pragma mark - OC的方法

- (void)_openCalendarAndFindEvents {
  
  // 读取事件
  NSArray *events = @[@{
                       @"name": @"生日聚会",
                       @"details": @{
                           @"location": @"六国饭点",
                           @"date": @"2019-08-13 06:14:52",
                           }
                       }];
  if (events) {// 假设这里是读取事件成功的回调
    
    // 调用读取事件成功的block
    self.resolve(events);
  } else {// 假设这里是读取事件失败的回调
    
    // 调用读取事件失败的block
    self.reject(@"failure", @"读取日历事件出错", nil);
  }
}

// 合适的时机，调用OC类的这个方法给原生模块发送数据
- (void)calendarEventReminderReceived:(NSNotification *)notification
{
  if (hasListeners) {// 如果有监听者再发出事件
    [self sendEventWithName:@"EventReminder" body:@{
                                                    @"name": @"生日聚会",
                                                    @"details": @{
                                                        @"location": @"六国饭点",
                                                        @"date": @"2019-08-13 06:14:52",
                                                        }
                                                    }];
  }
}

@end
